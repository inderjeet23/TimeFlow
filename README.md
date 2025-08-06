# TimeFlow - Freelancer Invoice Generator

A lightweight SaaS app that allows freelancers to upload a CSV time log and automatically generate a professional, branded invoice PDF in under 60 seconds.

## 🚀 Features

- **CSV Upload & Parsing**: Supports time tracking exports from Toggl, Clockify, Harvest, and more
- **Live Invoice Preview**: Real-time preview of your invoice as you configure it
- **Professional PDF Generation**: Clean, branded invoices with customizable business information
- **Freemium Model**: Free tier with watermark, premium features coming soon
- **No Backend Required**: Everything runs client-side for maximum privacy and speed

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **CSV Parsing**: PapaParse
- **PDF Generation**: pdf-lib
- **UI Components**: Custom components with Lucide React icons
- **Deployment**: Vercel-ready

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TimeFlow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Usage

### 1. Upload CSV File
- Drag and drop your time tracking CSV file
- Supported formats: Toggl, Clockify, Harvest, and generic CSV
- Expected columns: Client, Project, Date, Duration, Notes, Billable

### 2. Configure Invoice
- Fill in your business information
- Add client details
- Set hourly rates for each time entry
- Configure tax rates and invoice details

### 3. Preview & Download
- Review your invoice in real-time
- Download as professional PDF
- Free version includes watermark

## 📁 Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── globals.css     # Global styles and Tailwind config
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Main application page
├── components/         # React components
│   ├── CSVUploader.tsx # File upload component
│   ├── InvoiceForm.tsx # Invoice configuration form
│   └── InvoicePreview.tsx # Live invoice preview
├── lib/               # Utility functions
│   ├── csv-parser.ts  # CSV parsing and processing
│   ├── pdf-generator.ts # PDF generation logic
│   └── utils.ts       # Common utility functions
└── types/             # TypeScript type definitions
    └── index.ts       # Application types
```

## 🎯 MVP Features Completed

- ✅ CSV upload and parsing with fallback for header mismatches
- ✅ Invoice object generation from parsed data
- ✅ Live editable preview of invoice layout
- ✅ PDF rendering and export/download
- ✅ Invoice watermark for free users
- ✅ Basic styling with professional design
- ✅ Freemium limiter (watermark for free users)
- ✅ Responsive design for all devices

## 🚧 Future Enhancements

- **Authentication**: Supabase Auth integration
- **Client Management**: Save and reuse client information
- **Template System**: Multiple invoice templates and themes
- **Payment Integration**: Stripe payment links
- **Email Sending**: Direct invoice delivery via email
- **API Integrations**: Direct connections to Toggl, Clockify APIs
- **Recurring Invoices**: Automated invoice scheduling

## 📊 Sample Data

Use the included `sample-data.csv` file to test the application. It contains sample time tracking data that demonstrates the expected format.

## 🎨 Customization

### Styling
The application uses Tailwind CSS with a custom design system. You can customize colors, fonts, and layout by modifying:

- `src/app/globals.css` - Global styles and CSS variables
- `tailwind.config.js` - Tailwind configuration
- Individual component files for specific styling

### PDF Generation
PDF styling and layout can be customized in `src/lib/pdf-generator.ts`. The current implementation creates a professional invoice layout with:

- Business and client information
- Itemized time entries
- Tax calculations
- Professional typography

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app is a standard Next.js application and can be deployed to any platform that supports Node.js.

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please open an issue on GitHub.

---

**TimeFlow** - Transform your time logs into professional invoices in seconds! ⚡ 