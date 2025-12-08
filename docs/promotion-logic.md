# Promocode (Aksiya) Tizimi Texnik Dokumentatsiyasi

Bu hujjat Rolling Sushi ilovasidagi promocode/aksiya tizimining to'liq texnik tavsifini o'z ichiga oladi.

---

## Mundarija

1. [Umumiy Ko'rinish](#1-umumiy-korinish)
2. [Ma'lumotlar Modellari](#2-malumotlar-modellari)
3. [Promocode Turlari](#3-promocode-turlari)
4. [Shart Turlari](#4-shart-turlari)
5. [Maxsus Promocodelar](#5-maxsus-promocodelar)
6. [Jarayon Oqimi](#6-jarayon-oqimi)
7. [Narx Hisoblash](#7-narx-hisoblash)
8. [Saqlash va Qayta Tiklash](#8-saqlash-va-qayta-tiklash)
9. [API Integratsiyasi](#9-api-integratsiyasi)
10. [Asosiy Fayllar](#10-asosiy-fayllar)
11. [Xatolarni Boshqarish](#11-xatolarni-boshqarish)

---

## 1. Umumiy Ko'rinish

Promocode tizimi foydalanuvchilarga chegirmalar va bonus mahsulotlar olish imkonini beradi. Tizim quyidagi asosiy komponentlardan iborat:

```
┌─────────────────────────────────────────────────────────────────┐
│                      PROMOCODE TIZIMI                          │
├─────────────────────────────────────────────────────────────────┤
│  API (Poster)  →  PromocodeDialog  →  PromocodeStore  →  Order │
│                        ↓                    ↓                  │
│                   Tekshirish            Saqlash               │
│                        ↓                    ↓                  │
│                   Qo'llash             Hive Box               │
└─────────────────────────────────────────────────────────────────┘
```

### Asosiy Xususiyatlar:
- 3 xil chegirma turi (bonus, qat'iy summa, foiz)
- 3 xil shart turi (umumiy summa, kategoriya, aniq mahsulot)
- Maxsus promocodelar (tug'ilgan kun, birinchi buyurtma)
- Holat saqlanishi (ilova yopilganda ham promocode saqlanadi)
- Avtomatik bekor qilish (savat o'zgarganda shartlar tekshiriladi)

---

## 2. Ma'lumotlar Modellari

### 2.1 Promocode (Asosiy Model)

**Fayl:** `lib/Models/Promocode.dart`

```dart
class Promocode {
  final String? name;      // Format: "Tavsif $KOD" (masalan: "20% chegirma $SALE20")
  final int? id;           // Poster'dagi promotion_id
  final PromocodeParams? params;  // Parametrlar
}
```

**Nomi formati:**
- Promocode nomi `$` belgisi bilan ajratilgan
- Birinchi qism - tavsif (UI'da ko'rinadi)
- Ikkinchi qism - kod (foydalanuvchi kiritadi)
- Misol: `"Tug'ilgan kun chegirmasi $bday20"` → kod: `bday20`

### 2.2 PromocodeParams (Parametrlar)

```dart
class PromocodeParams {
  final int? discountValue;    // Chegirma qiymati (tiyin yoki foiz)
  final int? resultType;       // Promocode turi (1, 2, yoki 3)
  final int? clientsType;      // Mijoz turi (3 = faqat ro'yxatdan o'tganlar)
  final List<BonusProduct>? bonusProducts;  // Bonus mahsulotlar ro'yxati
  final int? bonusProductsPcs; // Har bir bonus mahsulotdan nechta
  final List<Condition>? conditions;  // Shartlar ro'yxati
}
```

**resultType qiymatlari:**
| Qiymat | Turi | Tavsif |
|--------|------|--------|
| 1 | Bonus mahsulot | Bepul mahsulot savatga qo'shiladi |
| 2 | Qat'iy summa | Aniq summa chegirma (masalan, 50,000 so'm) |
| 3 | Foiz | Foizli chegirma (masalan, 20%) |

**clientsType qiymatlari:**
| Qiymat | Tavsif |
|--------|--------|
| 3 | Faqat tizimga kirgan foydalanuvchilar uchun |
| boshqa | Barcha foydalanuvchilar uchun |

### 2.3 BonusProduct (Bonus Mahsulot)

```dart
class BonusProduct {
  final String? id;    // Mahsulot ID'si (Poster'dan)
  final int? count;    // Miqdor
}
```

### 2.4 Condition (Shart)

```dart
class Condition {
  final int? type;     // Shart turi (0, 1, yoki 2)
  final String? id;    // Kategoriya yoki mahsulot ID'si
  final int? sum;      // Minimal summa (tiyinda)
  final bool? active;  // Shart faolmi
}
```

**Muhim:** Summa tiyinda saqlanadi (1 so'm = 100 tiyin). UI'da ko'rsatishdan oldin 100 ga bo'linadi.

---

## 3. Promocode Turlari

### 3.1 Bonus Mahsulot (resultType = 1)

Foydalanuvchiga bepul mahsulot beriladi.

**Jarayon:**
1. `bonusProducts` ro'yxatidan mahsulotlar topiladi
2. Har bir mahsulot savatga `price: '0'` va `promocode: true` bilan qo'shiladi
3. Miqdor `bonusProductsPcs` dan olinadi

**Misol:**
```json
{
  "resultType": 1,
  "bonusProducts": [{"id": "123", "count": 1}],
  "bonusProductsPcs": 2
}
```
→ ID=123 bo'lgan mahsulotdan 2 dona bepul qo'shiladi

**Savatda ko'rinishi:**
```dart
{
  'productId': '123',
  'name': 'California Roll',
  'price': '0',
  'promocode': true,  // Bu bayroq orqali bonus ekanini aniqlaymiz
  'amount': '2'
}
```

### 3.2 Qat'iy Summa Chegirma (resultType = 2)

Buyurtma summasidan aniq qiymat ayriladi.

**Jarayon:**
1. `discountValue` tiyindan so'mga o'tkaziladi (÷100)
2. `PromocodeStore.promocodePrice` ga saqlanadi
3. Narx hisoblashda ayriladi

**Misol:**
```json
{
  "resultType": 2,
  "discountValue": 5000000  // 50,000 so'm (tiyinda)
}
```
→ Buyurtmadan 50,000 so'm ayriladi

**Hisoblash:**
```
Buyurtma: 150,000 so'm
Chegirma: 50,000 so'm
Jami: 100,000 so'm
```

### 3.3 Foizli Chegirma (resultType = 3)

Buyurtma summasidan foiz hisoblanadi.

**Ikki xil qo'llanishi:**

**A) Butun savatga (discountPromocode):**
- Shartlar `type: 0` bo'lganda yoki shart yo'q bo'lganda
- Barcha mahsulotlarga chegirma

**B) Faqat ma'lum mahsulotlarga (discountPromocodeProduct):**
- Shartlar `type: 1` yoki `type: 2` bo'lganda
- Faqat shartga mos mahsulotlarga chegirma

**Misol:**
```json
{
  "resultType": 3,
  "discountValue": 20,  // 20%
  "conditions": [{"type": 1, "id": "sushi_category_id"}]
}
```
→ Faqat sushi kategoriyasiga 20% chegirma

---

## 4. Shart Turlari

### 4.1 Umumiy Summa Sharti (type = 0)

Minimal buyurtma summasi talab qilinadi.

**Tekshirish:**
```dart
final requiredSum = (condition.sum ?? 0) ~/ 100;  // Tiyindan so'mga
if (totalSum < requiredSum) {
  // Xato: "100,000 so'm minimal buyurtma summasi"
}
```

**Misol:**
```json
{
  "type": 0,
  "sum": 10000000  // 100,000 so'm minimal
}
```

### 4.2 Kategoriya Sharti (type = 1)

Ma'lum kategoriyadan mahsulot va minimal summa talab qilinadi.

**Tekshirish:**
1. Savatdagi mahsulotlar kategoriyasi tekshiriladi
2. Shu kategoriya mahsulotlarining umumiy summasi hisoblanadi
3. `condition.sum` bilan solishtiriladi

**Misol:**
```json
{
  "type": 1,
  "id": "12345",  // Sushi kategoriya ID'si
  "sum": 5000000  // 50,000 so'm sushidan
}
```
→ Savatda 50,000 so'mlik sushi bo'lishi kerak

### 4.3 Aniq Mahsulot Sharti (type = 2)

Ma'lum mahsulot savatda bo'lishi kerak.

**Tekshirish:**
```dart
final hasProduct = Order.isInOrder(condition.id);
if (!hasProduct) {
  // Xato: "Savatga X mahsulotni qo'shing"
}
```

**Misol:**
```json
{
  "type": 2,
  "id": "67890",  // Mahsulot ID'si
  "sum": 0
}
```
→ ID=67890 mahsulot savatda bo'lishi kerak

---

## 5. Maxsus Promocodelar

### 5.1 Tug'ilgan Kun Promokodi (bday20)

Faqat foydalanuvchining tug'ilgan kunida ishlaydi.

**Tekshirish jarayoni:**
```dart
Future<bool> _checkBirthday() async {
  // 1. Foydalanuvchi tizimga kirganmi?
  if (!User.isKeyAvalible('id')) return false;

  // 2. Tug'ilgan kun ma'lumotini olish
  String? birthdayStr = User.getUserInfo('birthday');
  if (birthdayStr == null) {
    // API'dan olish
    final clientInfo = await Api.getClient(phone, password);
    birthdayStr = clientInfo['birthday'];
  }

  // 3. Sanani taqqoslash (faqat oy va kun)
  final birthday = DateTime.parse(birthdayStr);
  final today = DateTime.now();

  return today.month == birthday.month && today.day == birthday.day;
}
```

**Muhim:** Yil tekshirilmaydi, faqat oy va kun.

### 5.2 Birinchi Buyurtma Promokodi (first20)

Faqat foydalanuvchining birinchi buyurtmasida ishlaydi.

**Tekshirish jarayoni:**
```dart
Future<bool> _checkFirstOrder() async {
  final clientInfo = await Api.getClient(phone, password);

  // Comment maydonida buyurtmalar soni saqlanadi
  final comment = clientInfo['comment'];

  if (comment == null) return true;  // Comment yo'q = birinchi buyurtma

  final commentData = jsonDecode(comment);
  final orderLength = commentData['length'] ?? 0;

  return orderLength == 0;  // 0 = birinchi buyurtma
}
```

---

## 6. Jarayon Oqimi

### 6.1 Promocode Qo'llash

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROMOCODE QO'LLASH OQIMI                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Foydalanuvchi "Promocode" tugmasini bosadi                 │
│                         ↓                                       │
│  2. PromocodeDialog ochiladi                                   │
│                         ↓                                       │
│  3. Foydalanuvchi kodni kiritadi va "Qo'llash" bosadi          │
│                         ↓                                       │
│  4. Tekshirish:                                                │
│     ├─ Kod mavjudmi? (promotions ro'yxatidan qidirish)         │
│     ├─ Allaqachon boshqa kod qo'llanganmi?                     │
│     ├─ Autentifikatsiya kerakmi? (clientsType == 3)            │
│     └─ Shartlar bajarilganmi? (conditions)                     │
│                         ↓                                       │
│  5. Qo'llash (resultType bo'yicha):                            │
│     ├─ Tur 1: Bonus mahsulotlarni savatga qo'shish             │
│     ├─ Tur 2: promocodePrice o'rnatish                         │
│     └─ Tur 3: discountPromocode yoki discountPromocodeProduct  │
│                         ↓                                       │
│  6. Holatni saqlash (Hive box)                                 │
│                         ↓                                       │
│  7. UI yangilanadi (Basket ekrani)                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.2 Savat O'zgarganda Tekshirish

```dart
void validatePromocodeOnCartChange() {
  // Savat bo'shmi?
  if (Order.getOrderLength() == 0) {
    handleRemovePromo();
    return;
  }

  // Shartlar hali ham bajarilganmi?
  for (final condition in conditions) {
    switch (condition.type) {
      case 0:  // Minimal summa
        if (totalSum < requiredSum) → bekor qilish
      case 1:  // Kategoriya
        if (kategoriya mahsulotlari yo'q) → bekor qilish
      case 2:  // Aniq mahsulot
        if (mahsulot savatda yo'q) → bekor qilish
    }
  }

  // Bonus mahsulotlar hali savatdami?
  if (resultType == 1 && bonus_products_missing) {
    handleRemovePromo();
  }
}
```

---

## 7. Narx Hisoblash

### 7.1 getTotalPrice() Metodi

**Fayl:** `lib/Store/PromocodeStore.dart:741-788`

```dart
double getTotalPrice(double orderPrice) {
  // 1. Qat'iy summa chegirma
  if (promocodePrice.value > 0) {
    return (orderPrice - promocodePrice.value).clamp(0, double.infinity);
  }

  // 2. Mahsulot/kategoriya bo'yicha foiz
  if (discountPromocodeProduct.value > 0) {
    // Faqat mos mahsulotlardan chegirma
    int eligibleSum = calculateEligibleSum();
    final discount = eligibleSum * (discountPromocodeProduct.value / 100);
    return orderPrice - discount;
  }

  // 3. Butun savatga foiz
  if (discountPromocode.value > 0) {
    return orderPrice * (1 - discountPromocode.value / 100);
  }

  return orderPrice;
}
```

### 7.2 Hisoblash Misollari

**Misol 1: Qat'iy summa**
```
Savat: 150,000 so'm
Promocode: 50,000 so'm chegirma
─────────────────────────
Jami: 100,000 so'm
```

**Misol 2: Foizli chegirma (butun savat)**
```
Savat: 150,000 so'm
Promocode: 20% chegirma
Chegirma: 150,000 × 0.20 = 30,000 so'm
─────────────────────────
Jami: 120,000 so'm
```

**Misol 3: Foizli chegirma (faqat kategoriya)**
```
Savat:
  - Sushi: 100,000 so'm
  - Ichimlik: 20,000 so'm
  - Jami: 120,000 so'm

Promocode: Sushiga 20% chegirma
Chegirma: 100,000 × 0.20 = 20,000 so'm
─────────────────────────
Jami: 100,000 so'm
```

---

## 8. Saqlash va Qayta Tiklash

### 8.1 Hive Box

**Box nomi:** `promocode_state`

**Saqlanadigan maydonlar:**
| Kalit | Turi | Tavsif |
|-------|------|--------|
| `active_promocode` | String (JSON) | Faol promocode ma'lumotlari |
| `promocode_price` | double | Qat'iy summa chegirma |
| `discount_promocode` | double | Butun savatga foiz |
| `discount_promocode_product` | double | Mahsulot/kategoriyaga foiz |

### 8.2 Saqlash

```dart
void _savePromocodeState() {
  if (activePromocode.value != null) {
    _promocodeBox.put('active_promocode',
        jsonEncode(activePromocode.value!.toJson()));
  }
  _promocodeBox.put('promocode_price', promocodePrice.value);
  _promocodeBox.put('discount_promocode', discountPromocode.value);
  _promocodeBox.put('discount_promocode_product',
      discountPromocodeProduct.value);
}
```

### 8.3 Qayta Tiklash

```dart
void _restorePromocodeState() {
  final savedJson = _promocodeBox.get('active_promocode');
  if (savedJson != null) {
    activePromocode.value = Promocode.fromJson(jsonDecode(savedJson));
    promocodePrice.value = _promocodeBox.get('promocode_price') ?? 0.0;
    discountPromocode.value = _promocodeBox.get('discount_promocode') ?? 0.0;
    // ...

    // Bonus mahsulotlarni Order'dan qayta yuklash
    _restoreBonusProductsFromOrder();

    // Shartlarni tekshirish
    validatePromocodeOnCartChange();
  }
}
```

### 8.4 Tozalash (Logout)

**Fayl:** `lib/LocalMemory/Boxes.dart:118-123`

```dart
// Foydalanuvchi chiqib ketganda tozalanadi
await promocodeBox.clear();
```

---

## 9. API Integratsiyasi

### 9.1 Promocodelarni Olish

**Fayl:** `lib/Backend/Api.dart`

```dart
static Future<dynamic> getPromotions() async {
  // Poster API'dan promocodelar ro'yxatini olish
  final response = await http.get(
    Uri.parse('$baseUrl/api/clients.getPromotions')
  );
  return jsonDecode(response.body);
}
```

**Javob formati:**
```json
{
  "response": [
    {
      "promotion_id": 1,
      "name": "20% chegirma $SALE20",
      "params": {
        "result_type": 3,
        "discount_value": 20,
        "conditions": [...]
      }
    }
  ]
}
```

### 9.2 Mijoz Ma'lumotlarini Olish

```dart
static Future<Map<String, dynamic>> getClient(
    String phone, String password) async {
  // Tug'ilgan kun va buyurtmalar soni uchun
  // ...
  return {
    'res': true,
    'birthday': '1990-05-15',
    'comment': '{"length": 0}'  // Buyurtmalar soni
  };
}
```

---

## 10. Asosiy Fayllar

### Jadval

| Fayl | Maqsad |
|------|--------|
| `lib/Models/Promocode.dart` | Ma'lumotlar modellari |
| `lib/Store/PromocodeStore.dart` | Holat boshqaruvi, biznes mantiq |
| `lib/Screens/Promocode/PromocodeDialog.dart` | Promocode kiritish dialoggi |
| `lib/Screens/Order/Basket.dart` | Savat ekrani, dialog ochish |
| `lib/Screens/Order/PaymentAndLocation.dart` | Checkout, narx hisoblash |
| `lib/Screens/Order/endOfOrder.dart` | Buyurtma tasdiq ekrani |
| `lib/Backend/Api.dart` | API chaqiruvlari |
| `lib/LocalMemory/Order.dart` | Savat saqlash |
| `lib/LocalMemory/Boxes.dart` | Hive box'lar |
| `lib/Localzition/locals.dart` | Tarjimalar |

### Asosiy Metodlar

**PromocodeStore:**
- `applyPromocode()` - Promocode qo'llash
- `handleRemovePromo()` - Promocode bekor qilish
- `validatePromocodeOnCartChange()` - Savat o'zgarganda tekshirish
- `getTotalPrice()` - Chegirmali narxni hisoblash
- `getTotalDiscount()` - Chegirma qiymatini olish
- `getPromocodeDescription()` - UI uchun tavsif

**PromocodeDialog:**
- `handleApply()` - "Qo'llash" tugmasi bosilganda
- `validatePromocodeConditions()` - Shartlarni tekshirish
- `checkBirthday()` - Tug'ilgan kun tekshirish
- `checkFirstOrder()` - Birinchi buyurtma tekshirish

---

## 11. Xatolarni Boshqarish

### 11.1 Xato Xabarlari

| Holat | Xabar |
|-------|-------|
| Bo'sh kiritish | "Iltimos, promocode kiriting" |
| Noto'g'ri kod | "Noto'g'ri promocode" |
| Allaqachon qo'llangan | "Promocode allaqachon ishlatilmoqda" |
| Autentifikatsiya kerak | "Bu promocode uchun tizimga kirish kerak" |
| Minimal summa | "100,000 so'm minimal buyurtma summasi" |
| Kategoriya kerak | "Sushi kategoriyasidan mahsulot qo'shing" |
| Mahsulot kerak | "Savatga X mahsulotni qo'shing" |
| Tug'ilgan kun emas | "Bu promocode faqat tug'ilgan kuningizda amal qiladi" |
| Birinchi buyurtma emas | "Bu promocode faqat birinchi buyurtmangiz uchun" |

### 11.2 Avtomatik Bekor Qilish

Promocode avtomatik bekor qilinadi qachonki:
- Savat bo'shatilganda
- Kerakli mahsulot o'chirilganda
- Kerakli kategoriya mahsulotlari o'chirilganda
- Minimal summa endi bajarilmaganda
- Bonus mahsulotlar savatdan o'chirilganda

---

## Qo'shimcha Ma'lumot

### Tiyin va So'm

Poster API tiyinda ishlaydi:
- 1 so'm = 100 tiyin
- 100,000 so'm = 10,000,000 tiyin

Konvertatsiya:
```dart
final sumInSom = sumInTiyin ~/ 100;  // Tiyindan so'mga
final sumInTiyin = sumInSom * 100;   // So'mdan tiyinga
```

### Promocode Nomi Formati

```
"Tavsif $KOD"

Misol: "20% chegirma $SALE20"
  ├─ Tavsif: "20% chegirma" (UI'da ko'rsatiladi)
  └─ Kod: "SALE20" (foydalanuvchi kiritadi)

Ajratish:
final parts = name.split('\$');
final description = parts[0];  // "20% chegirma "
final code = parts[1];         // "SALE20"
```

### GetX Reaktivlik

Barcha qiymatlar `Rx` bilan saqlanadi va avtomatik UI yangilanishini ta'minlaydi:
```dart
final RxDouble promocodePrice = 0.0.obs;
final Rxn<Promocode> activePromocode = Rxn<Promocode>();

// UI'da Obx bilan ishlatish:
Obx(() => Text('Chegirma: ${promocodeStore.promocodePrice.value}'))
```

---

*Oxirgi yangilanish: 2025-yil*
