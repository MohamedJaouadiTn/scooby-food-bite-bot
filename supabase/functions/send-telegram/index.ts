import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderData } = await req.json();

    if (!orderData || !orderData.customer || !orderData.items) {
      return new Response(
        JSON.stringify({ error: 'Order data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Processing order:', orderData);

    // Save customer to database (upsert by phone)
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .upsert({
        name: orderData.customer.name,
        phone: orderData.customer.phone,
        address: orderData.customer.address
      }, { onConflict: 'phone' })
      .select()
      .single();

    if (customerError) {
      console.error('Error saving customer:', customerError);
    }

    // Save order to database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customer?.id,
        customer_name: orderData.customer.name,
        customer_phone: orderData.customer.phone,
        customer_address: orderData.customer.address,
        allergies: orderData.customer.allergies || null,
        items: orderData.items,
        total_price: orderData.totalPrice,
        telegram_sent: false
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error saving order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to save order', details: orderError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Order saved successfully:', order);

    // Fetch Telegram configuration
    const { data: config, error: configError } = await supabase
      .from('telegram_config')
      .select('bot_token, chat_id')
      .single();

    if (configError || !config) {
      console.error('Error fetching Telegram config:', configError);
      return new Response(
        JSON.stringify({ error: 'Failed to load Telegram configuration' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build Telegram message
    let message = `🆕 New Order #${order.id.slice(0, 8)}!\n\n`;
    
    orderData.items.forEach((item: any) => {
      message += `📦 ${item.name}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: ${item.price.toFixed(3)} TND\n`;
      
      if (item.extras && item.extras.length > 0) {
        message += `   Extras: ${item.extras.map((e: any) => e.name).join(', ')}\n`;
      }
      message += `\n`;
    });

    message += `💰 Total: ${orderData.totalPrice.toFixed(3)} TND\n\n`;
    message += `👤 Customer Information:\n`;
    message += `   Name: ${orderData.customer.name}\n`;
    message += `   Phone: ${orderData.customer.phone}\n`;
    message += `   Address: ${orderData.customer.address}\n`;

    if (orderData.customer.allergies) {
      message += `   ⚠️ Allergies/Preferences: ${orderData.customer.allergies}\n`;
    }

    // Send message to Telegram
    const telegramUrl = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;
    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: config.chat_id,
        text: message,
      }),
    });

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error('Telegram API error:', errorText);
      
      // Order saved but Telegram failed - still return success
      return new Response(
        JSON.stringify({ 
          success: true, 
          orderId: order.id,
          telegramError: 'Failed to send notification'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await telegramResponse.json();
    console.log('Message sent successfully to Telegram:', result);

    // Update order as telegram_sent
    await supabase
      .from('orders')
      .update({ telegram_sent: true, status: 'confirmed' })
      .eq('id', order.id);

    return new Response(
      JSON.stringify({ success: true, orderId: order.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-telegram function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
