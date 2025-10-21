import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, orderId } = await req.json()
    
    console.log('Sending Telegram notification for order:', orderId)

    // Create admin client to read telegram config securely
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Fetch telegram config securely (only accessible server-side)
    const { data: config, error: configError } = await supabase
      .from('telegram_config')
      .select('bot_token, chat_id')
      .single()

    if (configError || !config) {
      console.error('Failed to fetch Telegram config:', configError)
      throw new Error('Telegram configuration not found')
    }

    // Send message to Telegram
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${config.bot_token}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chat_id,
          text: message,
        }),
      }
    )

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text()
      console.error('Telegram API error:', errorText)
      throw new Error('Failed to send Telegram message')
    }

    console.log('Telegram notification sent successfully for order:', orderId)

    // Update order status to telegram_sent
    if (orderId) {
      const { error: updateError } = await supabase
        .from('orders')
        .update({ telegram_sent: true, status: 'confirmed' })
        .eq('id', orderId)

      if (updateError) {
        console.error('Failed to update order status:', updateError)
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in send-telegram-notification:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send notification'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
