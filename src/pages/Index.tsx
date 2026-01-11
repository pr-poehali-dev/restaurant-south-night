import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const menuItems: MenuItem[] = [
  { id: '1', name: 'Хачапури по-аджарски', description: 'Лодочка из теста с сыром сулугуни и яйцом', price: 450, category: 'hot', image: 'https://cdn.poehali.dev/projects/82cd6d2c-4139-4a8b-a275-721598aed948/files/5e6a0ebb-e481-43f1-a4bb-7fad5a041639.jpg' },
  { id: '2', name: 'Шашлык из баранины', description: 'Маринованная баранина на мангале с травами', price: 650, category: 'hot', image: 'https://cdn.poehali.dev/projects/82cd6d2c-4139-4a8b-a275-721598aed948/files/46dbb62a-f164-4acb-a26e-3f9d56543937.jpg' },
  { id: '3', name: 'Долма', description: 'Виноградные листья с начинкой из риса и мяса', price: 380, category: 'hot', image: '/placeholder.svg' },
  { id: '4', name: 'Плов узбекский', description: 'Рис с бараниной, морковью и специями', price: 420, category: 'hot', image: '/placeholder.svg' },
  { id: '5', name: 'Салат Чобан', description: 'Свежие томаты, огурцы, перец с зеленью', price: 280, category: 'salad', image: '/placeholder.svg' },
  { id: '6', name: 'Пхали ассорти', description: 'Паштеты из шпината, свеклы и фасоли с орехами', price: 350, category: 'salad', image: '/placeholder.svg' },
  { id: '7', name: 'Баклава', description: 'Слоеное тесто с орехами и медом', price: 250, category: 'dessert', image: 'https://cdn.poehali.dev/projects/82cd6d2c-4139-4a8b-a275-721598aed948/files/35d54c29-4b3a-460d-832d-2ff4803d98db.jpg' },
  { id: '8', name: 'Чурчхела', description: 'Грецкий орех в виноградном соке', price: 180, category: 'dessert', image: '/placeholder.svg' },
  { id: '9', name: 'Турецкий чай', description: 'Черный чай в традиционном стакане', price: 120, category: 'drink', image: '/placeholder.svg' },
  { id: '10', name: 'Айран', description: 'Освежающий кисломолочный напиток', price: 150, category: 'drink', image: '/placeholder.svg' },
];

export default function Index() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookingData, setBookingData] = useState({ name: '', phone: '', date: '', time: '', guests: '' });
  const [orderData, setOrderData] = useState({ name: '', phone: '', address: '', comment: '' });

  const addToCart = (item: MenuItem) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
    toast({ title: 'Добавлено в корзину', description: item.name });
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(c => c.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.id === id) {
        const newQty = c.quantity + delta;
        return newQty > 0 ? { ...c, quantity: newQty } : c;
      }
      return c;
    }).filter(c => c.quantity > 0));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Бронирование отправлено!', description: 'Мы свяжемся с вами в ближайшее время' });
    setBookingData({ name: '', phone: '', date: '', time: '', guests: '' });
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      toast({ title: 'Корзина пуста', description: 'Добавьте блюда в корзину', variant: 'destructive' });
      return;
    }
    toast({ title: 'Заказ оформлен!', description: `Сумма: ${totalPrice} ₽. Ожидайте звонка` });
    setCart([]);
    setOrderData({ name: '', phone: '', address: '', comment: '' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">🌙</div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">Южная ночь</h1>
          </div>
          <nav className="hidden md:flex gap-6 items-center">
            <a href="#menu" className="hover:text-secondary transition">Меню</a>
            <a href="#booking" className="hover:text-secondary transition">Бронирование</a>
            <a href="#contacts" className="hover:text-secondary transition">Контакты</a>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" size="sm" className="relative">
                  <Icon name="ShoppingCart" size={20} />
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-destructive text-xs">{cart.length}</Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="font-heading text-2xl">Корзина</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">Корзина пуста</p>
                  ) : (
                    <>
                      {cart.map(item => (
                        <Card key={item.id}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold">{item.name}</h4>
                              <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                                <Icon name="X" size={16} />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, -1)}>
                                  <Icon name="Minus" size={14} />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button variant="outline" size="sm" onClick={() => updateQuantity(item.id, 1)}>
                                  <Icon name="Plus" size={14} />
                                </Button>
                              </div>
                              <span className="font-semibold">{item.price * item.quantity} ₽</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="pt-4 border-t">
                        <div className="flex justify-between text-lg font-bold mb-4">
                          <span>Итого:</span>
                          <span>{totalPrice} ₽</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full" size="lg">Оформить заказ</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="font-heading text-2xl">Оформление доставки</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleOrder} className="space-y-4">
                              <div>
                                <Label htmlFor="order-name">Имя</Label>
                                <Input id="order-name" required value={orderData.name} onChange={e => setOrderData({...orderData, name: e.target.value})} />
                              </div>
                              <div>
                                <Label htmlFor="order-phone">Телефон</Label>
                                <Input id="order-phone" type="tel" required value={orderData.phone} onChange={e => setOrderData({...orderData, phone: e.target.value})} />
                              </div>
                              <div>
                                <Label htmlFor="order-address">Адрес доставки</Label>
                                <Input id="order-address" required value={orderData.address} onChange={e => setOrderData({...orderData, address: e.target.value})} />
                              </div>
                              <div>
                                <Label htmlFor="order-comment">Комментарий к заказу</Label>
                                <Textarea id="order-comment" value={orderData.comment} onChange={e => setOrderData({...orderData, comment: e.target.value})} />
                              </div>
                              <Button type="submit" className="w-full">Подтвердить заказ на {totalPrice} ₽</Button>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </header>

      <section className="relative bg-gradient-to-br from-primary via-accent to-secondary text-primary-foreground py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-6xl">✨</div>
          <div className="absolute top-20 right-20 text-5xl">🌙</div>
          <div className="absolute bottom-10 left-1/4 text-7xl">⭐</div>
          <div className="absolute bottom-20 right-10 text-6xl">🔥</div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10 animate-fade-in">
          <h2 className="text-5xl md:text-7xl font-heading font-bold mb-6">Южная ночь</h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-90">
            Традиционная кухня южных народов в атмосфере восточного гостеприимства
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" asChild>
              <a href="#menu">Посмотреть меню</a>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 border-white" asChild>
              <a href="#booking">Забронировать стол</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="menu" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 animate-fade-in">Наше меню</h2>
          <Tabs defaultValue="hot" className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
              <TabsTrigger value="hot">Горячее</TabsTrigger>
              <TabsTrigger value="salad">Салаты</TabsTrigger>
              <TabsTrigger value="dessert">Десерты</TabsTrigger>
              <TabsTrigger value="drink">Напитки</TabsTrigger>
            </TabsList>
            {['hot', 'salad', 'dessert', 'drink'].map(category => (
              <TabsContent key={category} value={category}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {menuItems.filter(item => item.category === category).map((item, idx) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition animate-scale-in" style={{animationDelay: `${idx * 0.1}s`}}>
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                      <CardHeader>
                        <CardTitle className="font-heading text-xl">{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-primary">{item.price} ₽</span>
                          <Button onClick={() => addToCart(item)}>
                            <Icon name="Plus" size={18} className="mr-2" />
                            В корзину
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section id="booking" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 animate-fade-in">Бронирование</h2>
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Забронировать столик</CardTitle>
                <CardDescription>Мы свяжемся с вами для подтверждения</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Ваше имя</Label>
                    <Input id="name" required value={bookingData.name} onChange={e => setBookingData({...bookingData, name: e.target.value})} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input id="phone" type="tel" required value={bookingData.phone} onChange={e => setBookingData({...bookingData, phone: e.target.value})} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Дата</Label>
                      <Input id="date" type="date" required value={bookingData.date} onChange={e => setBookingData({...bookingData, date: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="time">Время</Label>
                      <Input id="time" type="time" required value={bookingData.time} onChange={e => setBookingData({...bookingData, time: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="guests">Количество гостей</Label>
                    <Input id="guests" type="number" min="1" required value={bookingData.guests} onChange={e => setBookingData({...bookingData, guests: e.target.value})} />
                  </div>
                  <Button type="submit" className="w-full" size="lg">Отправить заявку</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-12 animate-fade-in">Контакты</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="animate-scale-in">
              <CardHeader>
                <CardTitle className="font-heading text-2xl flex items-center gap-2">
                  <Icon name="MapPin" size={24} />
                  Адрес
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">г. Москва, ул. Арбат, д. 15</p>
                <p className="text-muted-foreground mt-2">Ежедневно с 12:00 до 00:00</p>
              </CardContent>
            </Card>
            <Card className="animate-scale-in" style={{animationDelay: '0.1s'}}>
              <CardHeader>
                <CardTitle className="font-heading text-2xl flex items-center gap-2">
                  <Icon name="Phone" size={24} />
                  Телефон
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">+7 (962) 610-35-35</p>
                <div className="flex gap-4 mt-4">
                  <a href="#" className="text-primary hover:text-secondary transition">
                    <Icon name="Facebook" size={28} />
                  </a>
                  <a href="#" className="text-primary hover:text-secondary transition">
                    <Icon name="Instagram" size={28} />
                  </a>
                  <a href="#" className="text-primary hover:text-secondary transition">
                    <Icon name="MessageCircle" size={28} />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg font-heading">© 2026 Ресторан Южная ночь</p>
          <p className="text-sm opacity-80 mt-2">Традиции южного гостеприимства</p>
        </div>
      </footer>
    </div>
  );
}