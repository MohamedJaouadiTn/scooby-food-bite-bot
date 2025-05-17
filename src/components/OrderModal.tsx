
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { CartItem, ExtraItem, OrderFormData } from '@/types/menuTypes';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CartItem | null;
  extraOptions: ExtraItem[];
  onSubmitOrder: (item: CartItem, formData: OrderFormData) => void;
  currentLanguage: 'en' | 'fr';
  translations: any;
}

const OrderModal = ({ 
  isOpen, 
  onClose, 
  item, 
  extraOptions, 
  onSubmitOrder, 
  currentLanguage, 
  translations 
}: OrderModalProps) => {
  const [selectedExtras, setSelectedExtras] = useState<ExtraItem[]>([]);
  const [formData, setFormData] = useState<OrderFormData>({
    name: '',
    address: '',
    phone: '',
    allergies: '',
  });
  const [totalPrice, setTotalPrice] = useState(0);

  // Load saved user info
  useEffect(() => {
    const savedUserInfo = localStorage.getItem('scoobyfoodUserInfo');
    if (savedUserInfo) {
      const parsedUserInfo = JSON.parse(savedUserInfo);
      setFormData(prevState => ({
        ...prevState,
        name: parsedUserInfo.name || '',
        phone: parsedUserInfo.phone || '',
        address: parsedUserInfo.address || '',
      }));
    }
  }, []);

  // Calculate total price whenever selectedExtras changes
  useEffect(() => {
    if (item) {
      const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
      setTotalPrice(item.price + extrasTotal);
    }
  }, [selectedExtras, item]);

  // Initialize extras from passed options
  useEffect(() => {
    if (extraOptions) {
      setSelectedExtras([]);
    }
  }, [extraOptions]);

  const handleExtraToggle = (extraId: string) => {
    setSelectedExtras(prev => {
      const extra = extraOptions.find(opt => opt.id === extraId);
      if (!extra) return prev;

      const exists = prev.some(e => e.id === extraId);
      if (exists) {
        return prev.filter(e => e.id !== extraId);
      } else {
        return [...prev, { ...extra, selected: true }];
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save user info for future orders
    const userInfo = {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    };
    localStorage.setItem('scoobyfoodUserInfo', JSON.stringify(userInfo));
    
    // Submit the order with selected extras
    if (item) {
      const finalItem = {
        ...item,
        extras: selectedExtras,
      };
      onSubmitOrder(finalItem, formData);
    }
  };

  const t = (key: string) => {
    return translations[currentLanguage][key] || key;
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">{t('orderDetails')}</h2>
          <button 
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-4">
          <div className="mb-6">
            <h3 className="font-medium mb-2">{t('baseItem')}</h3>
            <div className="flex justify-between">
              <span>{currentLanguage === 'en' ? item.name : item.name}</span>
              <span>{item.price.toFixed(3)} {t('currency')}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('foodOptions')}</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {extraOptions.map((option) => (
                  <div key={option.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id={`option-${option.id}`} 
                        checked={selectedExtras.some(e => e.id === option.id)}
                        onCheckedChange={() => handleExtraToggle(option.id)}
                      />
                      <label 
                        htmlFor={`option-${option.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {currentLanguage === 'en' ? option.englishName : option.name}
                      </label>
                    </div>
                    <span className="text-sm">+{option.price.toFixed(3)} {t('currency')}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('yourInfo')}</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('deliveryAddress')}
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={3}
                  />
                </div>
                
                <div>
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('allergies')}
                  </label>
                  <textarea
                    id="allergies"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">{t('orderSummary')}</h3>
              <div className="border-t border-b py-4">
                <div className="flex justify-between font-semibold mb-2">
                  <span>{t('basePrice')}:</span>
                  <span>{item.price.toFixed(3)} {t('currency')}</span>
                </div>
                
                {selectedExtras.length > 0 && (
                  <div className="mb-2">
                    <div className="font-medium">{t('extras')}:</div>
                    {selectedExtras.map(extra => (
                      <div key={extra.id} className="flex justify-between text-sm pl-4">
                        <span>{currentLanguage === 'en' ? extra.englishName : extra.name}</span>
                        <span>{extra.price.toFixed(3)} {t('currency')}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>{t('totalPrice')}:</span>
                  <span>{totalPrice.toFixed(3)} {t('currency')}</span>
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              {t('placeOrder')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
