You are a senior React Native architect, mobile UX engineer, and product designer.

Build a production-quality mobile application for tailoring shops called:

"TailorFlow"

The application is a simple digital customer register, measurement manager,
order manager, payment tracker, and delivery tracker for local tailors.

The primary users are local tailoring-shop owners and workers, including
users with low literacy and limited experience using complex mobile apps.

The application must therefore prioritize:

- extremely simple navigation
- large touch targets
- recognizable icons
- minimum required text
- short labels
- strong color/status indicators
- visual cards instead of dense tables
- optional Urdu support
- voice input architecture
- phone-number-first customer lookup
- minimal typing
- one clear primary action per screen

Do NOT make the application look like an enterprise CRM.

It should feel like a simple mobile register made specifically for tailors.

========================================================
1. TECHNOLOGY STACK
========================================================

Use:

- React Native
- Expo
- TypeScript
- Expo Router
- NativeWind / Tailwind CSS for React Native
- React Query / TanStack Query
- Zustand for lightweight local/global UI state
- React Hook Form
- Zod
- Axios or typed fetch wrapper
- Expo SecureStore
- Expo Image Picker
- Expo Camera where necessary
- Expo Notifications
- Expo Haptics
- Expo Local Authentication optional
- Expo Audio for future voice notes
- Lucide React Native icons
- react-native-reanimated
- react-native-gesture-handler
- @gorhom/bottom-sheet where useful
- FlashList for large customer/order lists

Use clean architecture and reusable UI components.

Do NOT place API calls directly inside screen components.

========================================================
2. VISUAL DESIGN DIRECTION
========================================================

Use the attached/reference e-commerce application as visual inspiration.

The visual identity should use:

Primary Orange:
#F59E0B

Strong Primary Orange:
#F59F00

Dark Orange:
#EA8C00

Light Orange:
#FFF4D6

Very Light Orange:
#FFF9EB

Background:
#FFFCF7

Card Background:
#FFFFFF

Primary Text:
#1C1C1C

Secondary Text:
#777777

Muted Text:
#9CA3AF

Border:
#EFE8DA

Success:
#22C55E

Success Background:
#DCFCE7

Warning:
#F59E0B

Warning Background:
#FEF3C7

Danger:
#EF4444

Danger Background:
#FEE2E2

Info:
#3B82F6

Ready Status:
#16A34A

White:
#FFFFFF

The visual style should feel:

- warm
- trustworthy
- approachable
- local-business friendly
- modern but not overly futuristic

Use lots of white space.

Cards:
borderRadius: 18-24px

Buttons:
borderRadius: 14-18px

Inputs:
borderRadius: 14-16px

Bottom sheets:
borderRadius: 24px on top

Use very subtle shadows.

Do NOT use excessive gradients.

A gradient may be used only for:
- onboarding screen
- promotional/summary header
- important hero cards

Primary gradient:

#FFB000 -> #F28C00

========================================================
3. TYPOGRAPHY
========================================================

Use a simple readable font.

Recommended:

Inter

Or use Expo-compatible font:
- Inter Regular
- Inter Medium
- Inter SemiBold
- Inter Bold

Typography:

Hero:
28-32px
Bold

Screen Title:
22-24px
Bold

Card Title:
17-19px
SemiBold

Normal:
15-16px

Supporting Text:
13-14px

Very small text should be avoided.

For low-literacy users, labels should generally be at least 15px.

Numbers such as:

Rs. 5,000
12 Orders
4 Ready

should be larger and visually prominent.

========================================================
4. ICON SYSTEM
========================================================

Use Lucide React Native.

Never use random emoji as primary navigation icons.

Use consistent outlined icons.

Recommended icons:

Home
- House

Customers
- UsersRound

Orders
- ClipboardList

Measurements
- Ruler

Money/Payments
- WalletCards / Banknote

Delivery
- PackageCheck

Ready
- CircleCheckBig

Pending
- Clock3

Cutting
- Scissors

Stitching
- Shirt / Needle icon if available

Search
- Search

Phone
- Phone

Add
- Plus

Calendar
- CalendarDays

Camera
- Camera

Image
- Image

Voice
- Mic

Notifications
- Bell

WhatsApp
- MessageCircle

Settings
- Settings

Shop
- Store

Staff
- UserRoundCog

Delete
- Trash2

Edit
- Pencil

Back
- ChevronLeft

Forward
- ChevronRight

Payment received
- CircleDollarSign

Balance remaining
- BadgeDollarSign

History
- History

Customer details
- ContactRound

Location
- MapPin

Use:

24px icons for normal actions
26-28px for bottom navigation
32px for major actions

Icon containers can use light orange circular backgrounds.

========================================================
5. ACCESSIBILITY / LOW-LITERACY UX
========================================================

This requirement is critical.

Design every feature assuming that some tailors may have:

- limited English literacy
- limited reading skills
- low digital literacy
- difficulty typing
- cheap Android phones
- unreliable internet

Therefore:

Use icons together with labels.

Example:

[ + icon ]
"New Order"

instead of:

"Initiate transaction"

Use simple words:

Customer
Order
Measure
Payment
Ready
Today
Delivered

Avoid technical terminology.

Every important action should contain:

ICON + SHORT TEXT

Use big touch areas:

minimum 48x48
prefer 52-56px

Primary CTA buttons:

height approximately 54-58px.

Provide haptic feedback for major actions.

Example:

Customer saved -> light success vibration
Payment recorded -> success vibration
Delete action -> warning vibration

Whenever possible provide pre-defined options rather than typing.

For example:

Garment:

[ Shalwar Kameez ]
[ Shirt ]
[ Pant ]
[ Waistcoat ]
[ Suit ]
[ Other ]

Instead of making the tailor type the garment name.

Use customer phone number as an important identifier.

Support:
- Urdu
- English

Architecture should allow adding:
- Roman Urdu

later.

Example label architecture:

t('customer')
t('newOrder')
t('measurements')

Never hard-code important UI text.

========================================================
6. NAVIGATION ARCHITECTURE
========================================================

Use Expo Router.

Structure:

app/
│
├── _layout.tsx
│
├── index.tsx
│
├── onboarding/
│   ├── index.tsx
│   └── language.tsx
│
├── auth/
│   ├── login.tsx
│   ├── otp.tsx
│   └── shop-setup.tsx
│
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── customers.tsx
│   ├── orders.tsx
│   ├── calendar.tsx
│   └── more.tsx
│
├── customer/
│   ├── new.tsx
│   └── [id]/
│       ├── index.tsx
│       ├── measurements.tsx
│       ├── orders.tsx
│       └── edit.tsx
│
├── order/
│   ├── new.tsx
│   └── [id]/
│       ├── index.tsx
│       ├── measurements.tsx
│       ├── design.tsx
│       ├── payment.tsx
│       └── status.tsx
│
├── measurements/
│   ├── new.tsx
│   └── templates.tsx
│
├── payments/
│   └── index.tsx
│
├── notifications/
│   └── index.tsx
│
└── settings/
    ├── index.tsx
    ├── shop.tsx
    ├── language.tsx
    ├── measurement-templates.tsx
    └── notifications.tsx

========================================================
7. BOTTOM NAVIGATION
========================================================

Bottom navigation should contain only five items:

Home
Customers
New Order
Orders
More

Use:

Home icon
Users icon
central Plus button
ClipboardList
Menu/More icon

The center New Order button should visually stand out.

Example:

       Customers       +       Orders
Home                                More

The central button should be:

Orange circular button
56-64px
white Plus icon

Label:
New Order

Do not overcrowd navigation.

========================================================
8. SPLASH / ONBOARDING
========================================================

Create a premium but simple splash screen inspired by the orange reference image.

Background:

orange gradient

Center:

simple tailoring illustration/icon:
Scissors + measuring tape / shirt

Logo:

DarziBook

Tagline:

"Your Tailor Register"

Urdu alternative:

"آپ کی ڈیجیٹل درزی بک"

Bottom:

[ Get Started ]

White button with orange icon.

Optional:
"اردو"

button/selector.

Onboarding should have maximum 2-3 slides.

Slide 1:
Customers & Measurements

Slide 2:
Orders & Deliveries

Slide 3:
Payments & Reminders

Do not create 5-6 onboarding slides.

========================================================
9. LOGIN SCREEN
========================================================

Keep login extremely simple.

Logo

Welcome Back

Phone Number

+92 | 3XX XXXXXXX

Primary:

Continue

Alternative:

Use PIN

Avoid email/password as primary authentication.

Use OTP architecture.

========================================================
10. SHOP SETUP
========================================================

First login:

Set Up Your Shop

Fields:

Shop Name
Owner Name
Phone
City / Area

Optional:
Shop photo/logo

Language:

English
اردو

Primary CTA:

Start Using DarziBook

========================================================
11. HOME / DASHBOARD SCREEN
========================================================

This should be the most useful screen.

Header:

Good Morning, Ahmed

small:
Ahmed Tailors

Right:
notification bell
shop/avatar image

Below:

Search bar

"Search customer or phone"

Search icon left
Mic icon right

Then create a horizontal quick-action area:

New Order
Add Customer
Payment
Measurements

Use large icon cards.

Example:

┌───────────────┐ ┌───────────────┐
│      +        │ │      👤       │
│  New Order    │ │ Add Customer  │
└───────────────┘ └───────────────┘

Use actual icons instead of emoji.

Then show:

Today's Work

Three/four summary cards:

Today
7 Orders

Ready
4

In Stitching
12

Balance
Rs. 34,500

Use corresponding icon and status color.

Do not use complicated charts.

Next:

Today's Deliveries

Customer cards:

[ AK ]
Ali Khan
2 Shalwar Kameez
Today, 5:00 PM

[ Ready ]

Make the status a colored pill.

Then:

Upcoming

Tomorrow
8 Oct
etc.

Floating or visible CTA:

+ New Order

========================================================
12. CUSTOMER LIST
========================================================

Header:

Customers

Right:
+ icon

Search:

"Name or phone"

Below allow simple filters:

All
Recent
Due Payment

Customer card:

Avatar / initials

Muhammad Khalil

03XX XXXXXXX

Last order:
2 Shalwar Kameez

Small badges:

3 Orders
Rs. 2,500 Due

Right:
ChevronRight

Use large cards.

Provide phone button:

[phone icon]

and WhatsApp/message button.

========================================================
13. ADD CUSTOMER SCREEN
========================================================

Title:
New Customer

Fields:

Full Name *
Phone Number *

Optional:
Area
Notes

Do not require email.

Buttons:

Save Customer

Optional secondary:

Save & New Order

After creating customer:

show success bottom sheet:

Customer Saved ✓

[ Create Order ]

========================================================
14. CUSTOMER PROFILE
========================================================

Top:

Avatar
Muhammad Khalil
03XX XXXXXXX

Quick Actions:

Call
Order
Measure
Payment

Large icons.

Then cards:

Measurements
Last updated 12 Sep

[ View Measurements ]

Orders
8 total

[ View Orders ]

Outstanding Balance
Rs. 2,500

[ Record Payment ]

Recent Orders

Show 2-3 latest.

========================================================
15. MEASUREMENT SYSTEM
========================================================

This is a core feature.

Never use one massive measurement form.

First select garment:

"What are you measuring?"

Large visual cards:

Shalwar Kameez
Shirt
Pant
Waistcoat
Suit
Other

After selection:

Show garment-specific measurement form.

Example:

KAMEEZ

Length
[ 42 ] inches

Shoulder
[ 18 ]

Chest
[ 40 ]

Sleeve
[ 24 ]

Neck
[ 15.5 ]

Waist
[ 38 ]

Hip
[ 42 ]

Bottom
[ 22 ]

SHALWAR

Length
[ 40 ]

Waist
[ 36 ]

Hip
[ 42 ]

Bottom
[ 14 ]

Use number keyboard.

Each field should have:

measurement name
simple optional illustration later
large number input
unit

Allow units:

inch
cm

Default:
inch

Add buttons:

Use Previous Measurements

and

Copy Previous

Add:

Voice Entry

Mic button:

"Speak Measurements"

Architecture should support future voice extraction.

For example:

"Kameez length 42, chest 40, sleeve 24"

could later populate fields.

Do not implement fake AI now unless backend exists.

========================================================
16. MEASUREMENT VERSIONING
========================================================

Never overwrite historical measurements.

Measurement object should contain:

id
customerId
garmentTypeId
createdAt
updatedAt
version
measurements
notes

Display:

Current Measurements

Updated:
12 Sep 2026

Previous:

Jan 2026
Aug 2025

Button:

Use This Version

========================================================
17. NEW ORDER FLOW
========================================================

New order should be a guided step flow.

Do not show one huge form.

Progress:

Customer
Garment
Measure
Design
Payment
Delivery

Use simple step indicator.

------------------------------------------------
STEP 1 — CUSTOMER
------------------------------------------------

Search:

Phone or customer name

Show results.

Button:

+ New Customer

After selecting:

Customer card appears.

------------------------------------------------
STEP 2 — GARMENT
------------------------------------------------

"What are we stitching?"

cards:

Shalwar Kameez
Pant
Shirt
Waistcoat
Suit
Other

Quantity:

[-] 2 [+]

Support multiple order items.

Example:

2 × Shalwar Kameez
1 × Waistcoat

------------------------------------------------
STEP 3 — MEASUREMENTS
------------------------------------------------

Show:

Previous measurement available

12 Sep 2026

[ Use Previous ]

or

[ Take New ]

This should reduce work for repeat customers.

------------------------------------------------
STEP 4 — DESIGN
------------------------------------------------

Use visual selectable options.

Fit:

Slim
Regular
Loose

Collar:

Band
Normal
Other

Cuff:

Round
Square
Button

Pocket:

None
1
2

Allow:

+ Add Photo

Photo can come from:

Camera
Gallery

Description:

"Customer reference design"

Notes:

large microphone icon

"Add note"

Support typed/voice notes architecture.

------------------------------------------------
STEP 5 — PAYMENT
------------------------------------------------

Total Price

Rs.
[ 5,000 ]

Advance

Rs.
[ 2,000 ]

Automatically calculate:

Remaining
Rs. 3,000

Payment method:

Cash
JazzCash
Easypaisa
Bank
Other

Use icon cards.

------------------------------------------------
STEP 6 — DELIVERY
------------------------------------------------

Select date using big calendar.

Quick options:

Today
Tomorrow
3 Days
1 Week

Then optionally select time.

Show:

Delivery

15 Oct
Thursday
5:00 PM

CTA:

Create Order

========================================================
18. ORDER SUCCESS SCREEN
========================================================

Show large green/orange checkmark.

"Order Created"

Order #DB-1042

Customer:
Muhammad Khalil

Delivery:
15 Oct

Balance:
Rs. 3,000

Actions:

[ Share Receipt ]

[ WhatsApp Customer ]

[ View Order ]

Secondary:

Back Home

========================================================
19. ORDER DETAILS
========================================================

Header:

Order #1042

Status badge:
Stitching

Customer card.

Garments:

2 × Shalwar Kameez

Payment:

Total        Rs. 5,000
Paid         Rs. 2,000
Remaining    Rs. 3,000

Delivery:

15 October
5 PM

Then:

Order Progress

Received ✓
Cutting ✓
Stitching ●
Finishing ○
Ready ○
Delivered ○

Use icons and colors.

Actions:

Update Status
Record Payment
Call Customer
WhatsApp
View Measurements

========================================================
20. ORDER STATUS UX
========================================================

Statuses:

Received
Cutting
Stitching
Finishing
Ready
Delivered
Cancelled

Use:

Received:
gray/blue

Cutting:
orange
Scissors icon

Stitching:
amber
shirt icon

Finishing:
purple if necessary

Ready:
green
CircleCheck

Delivered:
dark green

Cancelled:
red

Never communicate status using color only.

Always show:

ICON + TEXT + COLOR

========================================================
21. ORDERS SCREEN
========================================================

Header:
Orders

Search:
Customer / Order #

Filter chips:

All
Today
Late
Ready
Unpaid

Cards should show:

Order #1042

Muhammad Khalil

2 × Shalwar Kameez

Delivery:
Today

Status:
Stitching

Balance:
Rs. 3,000

Cards should be easy to scan.

Orders overdue should display:

Late

in red but avoid overly aggressive design.

========================================================
22. TODAY / CALENDAR
========================================================

Calendar screen is primarily a delivery calendar.

Top:

October 2026

Calendar

Days containing deliveries show orange dots.

After selecting date:

Deliveries — 15 Oct

Cards show:

10:00
Ali Khan
1 Suit
Ready

2:00
Ahmed
2 Shalwar Kameez
Stitching

Allow:

Mark Ready

directly from card when appropriate.

========================================================
23. PAYMENTS SCREEN
========================================================

Simple dashboard:

Pending Balance
Rs. 34,500

Received This Month
Rs. 92,000

Do not emphasize financial analytics initially.

Filters:

Unpaid
Partial
Paid

Payment card:

Muhammad Khalil

Order #1042

Total
Rs. 5,000

Paid
Rs. 2,000

Due
Rs. 3,000

CTA:

Record Payment

========================================================
24. RECORD PAYMENT
========================================================

Order:
#1042

Remaining:
Rs. 3,000

Amount received:

[ Rs. __________ ]

Quick buttons:

500
1000
2000
Full Amount

Method:

Cash
JazzCash
Easypaisa
Bank

CTA:

Payment Received

After save:

large check icon

"Payment Saved"

Remaining:
Rs. 1,000

========================================================
25. DIGITAL RECEIPT
========================================================

Design shareable receipt:

DARZIBOOK
Ahmed Tailors

Order #1042

Muhammad Khalil
03XX XXXXXXX

---------------------

2 × Shalwar Kameez

Total:
Rs. 5,000

Paid:
Rs. 2,000

Balance:
Rs. 3,000

Delivery:
15 Oct 2026

---------------------

Thank You

Buttons:

Share
WhatsApp
Save Image

Keep receipt clean enough for WhatsApp sharing.

========================================================
26. NOTIFICATIONS
========================================================

Notifications screen:

Today's deliveries

Order ready reminders

Pending payments

Examples:

"Ali's order is due today"

"Muhammad Khalil's order is ready"

"Rs. 3,000 payment is pending"

Use simple notification cards.

========================================================
27. WHATSAPP ARCHITECTURE
========================================================

Create abstraction:

services/messaging/

Do not tightly couple WhatsApp provider with UI.

Functions:

sendOrderCreated()
sendOrderReady()
sendDeliveryReminder()
sendPaymentReminder()
shareReceipt()

Initial implementation may use:

Linking.openURL()

with WhatsApp deep-link.

Future backend can integrate:

WhatsApp Cloud API
or
Twilio.

========================================================
28. VOICE-FIRST FUTURE ARCHITECTURE
========================================================

Because this targets low-literacy tailors, build components so voice can
be integrated later.

Reusable component:

<VoiceInputButton />

Use on:

customer search
order notes
measurement entry
design notes
customer lookup

Design:

large circular orange microphone button

When recording:

pulse animation

Timer:
00:05

States:

idle
recording
processing
completed
error

Do NOT fake transcription.

Use clean service interface:

VoiceService.transcribe()

so backend implementation can be connected later.

========================================================
29. REUSABLE COMPONENTS
========================================================

Create:

components/
  ui/
    AppButton.tsx
    AppInput.tsx
    AppHeader.tsx
    AppCard.tsx
    SearchBar.tsx
    IconButton.tsx
    EmptyState.tsx
    StatusBadge.tsx
    CustomerAvatar.tsx
    AmountText.tsx
    SectionHeader.tsx
    BottomSheet.tsx
    ConfirmDialog.tsx

  customers/
    CustomerCard.tsx
    CustomerQuickActions.tsx

  orders/
    OrderCard.tsx
    OrderStatus.tsx
    OrderProgress.tsx
    GarmentCard.tsx

  measurements/
    MeasurementField.tsx
    MeasurementGroup.tsx
    MeasurementTemplateCard.tsx

  payment/
    PaymentSummary.tsx
    PaymentMethodSelector.tsx

  voice/
    VoiceInputButton.tsx

  common/
    LanguageSwitcher.tsx
    LoadingSkeleton.tsx

========================================================
30. DATA MODEL
========================================================

Use frontend domain models similar to:

User
TailorShop
Customer
GarmentType
MeasurementTemplate
CustomerMeasurement
Order
OrderItem
OrderStatusHistory
Payment
DesignPreference
Attachment
Notification

Customer:

id
shopId
name
phone
area?
notes?
createdAt
updatedAt

Measurement:

id
customerId
garmentType
version
unit
values
notes
createdAt

Order:

id
shopId
customerId
orderNumber
status
subtotal
discount
total
paidAmount
balance
deliveryDate
notes
createdAt
updatedAt

OrderItem:

id
orderId
garmentTypeId
quantity
price
measurementSnapshot
designPreferences

VERY IMPORTANT:

Each order should preserve a measurement snapshot.

If the customer changes measurements later, old orders must still contain
the original measurements used for that garment.

========================================================
31. API ARCHITECTURE
========================================================

Use:

src/
  api/
  services/
  hooks/
  stores/
  schemas/
  types/
  constants/
  utils/
  i18n/
  theme/

Example API structure:

api/
  auth.api.ts
  customers.api.ts
  orders.api.ts
  measurements.api.ts
  payments.api.ts
  notifications.api.ts

React Query hooks:

useCustomers()
useCustomer()
useCreateCustomer()

useOrders()
useOrder()
useCreateOrder()
useUpdateOrderStatus()

useMeasurements()
useSaveMeasurements()

usePayments()
useRecordPayment()

Use query invalidation correctly.

========================================================
32. OFFLINE-FRIENDLY BEHAVIOR
========================================================

Tailors may have weak internet.

Design application architecture for eventual offline support.

At minimum:

cache customer list
cache recent orders
cache measurement profiles

Show:

Offline

small badge when disconnected.

Do not make UI unusable just because a request fails.

Future architecture can use:

SQLite
Expo SQLite

for offline-first synchronization.

Keep data layer abstract enough to add this later.

========================================================
33. EMPTY STATES
========================================================

Never show a blank screen.

Example customers:

[Users icon]

"No customers yet"

"Add your first customer"

[ Add Customer ]

Orders:

"No orders today"

Measurements:

"No measurements saved"

[ Add Measurements ]

========================================================
34. ERROR HANDLING
========================================================

Use human language.

Bad:

"HTTP Error 422"

Good:

"Phone number is not valid."

Bad:

"Request failed."

Good:

"Couldn't save the order. Check your internet and try again."

Use toast notifications sparingly.

Use inline form validation.

========================================================
35. ANIMATION
========================================================

Use subtle animation only.

Allowed:

screen transitions
button press scaling
card entrance
success check
mic pulse
status change

Avoid unnecessary animations.

Target low/mid-range Android hardware.

========================================================
36. PERFORMANCE
========================================================

Optimize primarily for Android.

Use:

FlashList for long lists
memoization where actually needed
optimized image sizes
lazy screen loading
React Query caching

Avoid excessive shadows and blur.

Do not render large unoptimized customer/order arrays.

========================================================
37. RESPONSIVE DESIGN
========================================================

Primary target:

Android phones

Approximately:

360-430px width

Also support:

larger phones
iPhone

Use SafeAreaView.

Do not hardcode layouts for one device size.

========================================================
38. INTERNATIONALIZATION
========================================================

Implement i18n architecture from day one.

Locales:

en
ur

Example:

{
  "home": "Home",
  "customers": "Customers",
  "orders": "Orders",
  "newOrder": "New Order",
  "measurements": "Measurements",
  "payment": "Payment",
  "ready": "Ready",
  "delivered": "Delivered"
}

Urdu should support RTL.

Switch direction correctly when Urdu is selected.

Do NOT just translate strings without considering layout direction.

========================================================
39. SETTINGS SCREEN
========================================================

Sections:

Shop

Shop Information

Measurement Settings

Language
English / اردو

Notifications

Receipt Settings

Data Backup

Staff
(future)

Help

Logout

Use icons for every row.

========================================================
40. FIRST VERSION SCOPE
========================================================

Implement these first:

1. Splash
2. Onboarding
3. Authentication UI
4. Shop setup
5. Dashboard
6. Customer list
7. Customer creation
8. Customer details
9. Measurement forms
10. Measurement history
11. New order wizard
12. Orders list
13. Order details
14. Status updates
15. Payment recording
16. Delivery calendar
17. Digital receipt
18. Notifications
19. Settings
20. English/Urdu architecture

Do not build:

marketplace
customer mobile app
complex inventory
payroll
AI chatbot
advanced accounting
delivery logistics

during the first MVP.

========================================================
41. HOME SCREEN VISUAL COMPOSITION
========================================================

The screen should visually resemble the design quality of the provided
orange e-commerce reference.

Approximate hierarchy:

--------------------------------
11:00                🔔   Avatar

Good Morning,
Ahmed 👋
Ahmed Tailors

[ Search customer or phone    🎤 ]

QUICK ACTIONS

[ +             ] [ Customer ]
[ New Order     ] [ Add      ]

TODAY

[ 7         ] [ 4          ]
[ Orders    ] [ Ready      ]

[ 12        ] [ Rs 34,500  ]
[ Stitching ] [ Balance    ]

Today's Deliveries       View All

[AK] Ali Khan
     2 Shalwar Kameez
     Today • 5:00 PM
                         READY

[MK] Muhammad Khalil
     1 Waistcoat
     Today • 7:00 PM
                       STITCHING

--------------------------------

Bottom Navigation

Home Customers [+] Orders More
--------------------------------

Use real icons, not emoji.

========================================================
42. DESIGN RULES
========================================================

Follow these rules strictly.

RULE 1:
One primary action per screen.

RULE 2:
Never require unnecessary typing.

RULE 3:
Use visual choices whenever possible.

RULE 4:
Never display complex tables on mobile.

RULE 5:
Customer name, delivery date, order status and balance should always be
easy to identify.

RULE 6:
Keep common tasks within 2-4 taps.

RULE 7:
Repeat customers should not need to re-enter measurements.

RULE 8:
Do not use tiny text.

RULE 9:
Do not hide important actions behind long menus.

RULE 10:
Optimize for someone using the application while physically working in a
tailoring shop.

========================================================
43. CODE QUALITY
========================================================

Use strict TypeScript.

Do not use `any` unless absolutely necessary.

Use Zod schemas.

Separate:

UI
domain types
API
state
validation
business logic

Do not create 800-line screens.

Break large screens into components.

Keep constants such as:

colors
spacing
radius
typography
order statuses
garment types

in centralized files.

========================================================
44. THEME STRUCTURE
========================================================

Create:

theme/colors.ts
theme/spacing.ts
theme/typography.ts
theme/radius.ts
theme/shadows.ts

Example:

colors = {
  primary: '#F59E0B',
  primaryDark: '#EA8C00',
  primaryLight: '#FFF4D6',
  background: '#FFFCF7',
  surface: '#FFFFFF',
  text: '#1C1C1C',
  textSecondary: '#777777',
  border: '#EFE8DA',
  success: '#22C55E',
  danger: '#EF4444',
  info: '#3B82F6'
}

========================================================
45. END GOAL
========================================================

The final product should feel like:

"WhatsApp-level simplicity + modern mobile banking clarity +
tailoring-specific workflows."

A tailor who is not highly educated should be able to open the application
and understand:

where his customers are
what needs to be stitched
what is due today
who owes money
which orders are ready

without receiving formal software training.

Prioritize usability over feature count.

Build the implementation incrementally.

First:
create project architecture, theme, reusable components and navigation.

Second:
build mock-data screens.

Third:
connect API layer.

Fourth:
implement authentication and persistence.

Fifth:
implement full workflows and validation.

Do not prematurely implement future AI functionality.

At every stage ensure:

npm/typecheck passes
Expo starts correctly
routes work
no TypeScript errors
no missing imports
no console errors
Android layout is tested.