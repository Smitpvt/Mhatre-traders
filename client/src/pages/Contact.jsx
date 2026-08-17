import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BASE_URL } from "../config/api.js";
import { toast } from "react-hot-toast";
import SectionHeader from "../components/ui/SectionHeader";
import { FiMail, FiPhone, FiMapPin, FiClock, FiMessageSquare } from "react-icons/fi";
import SEO from "../components/seo/SEO";
import { RiWhatsappLine } from "react-icons/ri";
import {
  WHATSAPP_NUMBER,
  OFFICE_PHONE,
  OFFICE_EMAIL,
  OFFICE_ADDRESS,
  GOOGLE_MAPS_EMBED_URL,
  DEFAULT_WHATSAPP_MESSAGE,
  BUSINESS_HOURS
} from "../constants/contact";

// Helper to save requests to localStorage (defined outside component for purity/react-compiler)
const saveEnquiryToLocalStorage = (data) => {
  try {
    const saved = localStorage.getItem('mhatre_enquiries');
    let currentEnquiries = [];
    if (saved) {
      currentEnquiries = JSON.parse(saved);
    } else {
      // Seed with initial enquiries to keep demo data consistent
      currentEnquiries = [
        {
          id: 'enq-1',
          customerName: 'Patil Constructions',
          phone: '+91 98220 12345',
          category: 'Cement & Aggregates',
          message: 'Need urgent quote for 450 bags of Ultratech 53-grade cement for Alibag site delivery.',
          status: 'NEW',
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        },
        {
          id: 'enq-2',
          customerName: 'Ramesh Sawant',
          phone: '+91 99234 56789',
          category: 'Structural Steel & Rebars',
          message: 'Looking for 3 Tons of Tata Tiscon 12mm TMT bars. Please confirm rate inclusive of transit.',
          status: 'CONTACTED',
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
        },
        {
          id: 'enq-3',
          customerName: 'Karan Mhatre',
          phone: '+91 94220 98765',
          category: 'Pipes & Fittings',
          message: 'Need 120 pieces of Astral 4-inch PVC drainage pipe. Please send best price sheet.',
          status: 'COMPLETED',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ];
    }

    let displayMessage = data.message;
    if (data.company) {
      displayMessage += `\n\n[Company: ${data.company}]`;
    }
    if (data.email) {
      displayMessage += `\n[Email: ${data.email}]`;
    }

    const newEnquiry = {
      id: `enq-${Date.now()}`,
      customerName: data.name,
      phone: data.phone,
      category: data.category,
      message: displayMessage,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    currentEnquiries.unshift(newEnquiry);
    localStorage.setItem('mhatre_enquiries', JSON.stringify(currentEnquiries));
  } catch (err) {
    console.error("Failed to save enquiry:", err);
  }
};

export default function Contact() {
  const [categoriesList, setCategoriesList] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch(`${BASE_URL}/public/categories`).then(r => r.json());
        if (res.success && res.data) {
          setCategoriesList(res.data.categories);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  const onSubmit = (data) => {
    console.log("Inquiry Submitted:", data);

    // Save request to localStorage so it is seen in the admin panel enquiries
    saveEnquiryToLocalStorage(data);

    toast.success("Inquiry Submitted! Our Alibaug desk will send details in 24 hours.");
    reset();
  };

  const listToRender = categoriesList.length > 0 ? categoriesList : [
    { id: '1', title: 'Cement & Aggregates' },
    { id: '2', title: 'Structural Steel & Rebars' },
    { id: '3', title: 'Pipes & Fittings' }
  ];

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://mhatretraders.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact Sales Desk",
        "item": "https://mhatretraders.com/contact"
      }
    ]
  };

  return (
    <div className="pt-36 pb-24 bg-brand-ivory min-h-screen relative">
      <SEO 
        title="Contact Sales Desk | Request Bulk Quotes"
        description="Connect with the Mhatre Traders sales desk. Get direct delivery quotes to Alibaug coastal locations, submit supply sheets, or send WhatsApp inquiries."
        keywords="contact mhatre traders, building materials alibaug address, construction delivery quotes"
        schema={contactSchema}
      />
      {/* Background Grid */}
      <div className="absolute inset-0 editorial-grid opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="border-b border-brand-border pb-8 mb-8">
          <SectionHeader
            subtitle="INQUIRY DESK"
            title="Connect With Sales"
            description="Request a bulk delivery quote or submit a structural supply checklist. Our Alibaug office responds within 24 hours."
            as="h1"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Column: Form Card */}
          <div className="bg-brand-linen/15 border-[0.5px] border-brand-border p-8 md:p-12 rounded-3xl shadow-sm space-y-6">
            <div className="space-y-2">
              <h3 className="font-headings font-bold text-2xl text-brand-dark uppercase tracking-wide">
                Quote Request
              </h3>
              <p className="text-xs text-brand-muted font-light leading-relaxed">
                Provide your project specifications below. All fields marked with * are required.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Row 1: Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: "Name is required" })}
                    className="w-full bg-brand-ivory border border-brand-border rounded-xl px-4 py-2.5 text-base md:text-sm focus:outline-none focus:border-brand-terracotta text-brand-dark"
                    placeholder="Enter your name"
                  />
                  {errors.name && (
                    <span className="text-xs text-brand-terracotta">{errors.name.message}</span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                    Company / Contractor
                  </label>
                  <input
                    type="text"
                    {...register("company")}
                    className="w-full bg-brand-ivory border border-brand-border rounded-xl px-4 py-2.5 text-base md:text-sm focus:outline-none focus:border-brand-terracotta text-brand-dark"
                    placeholder="e.g. Alibaug Developers"
                  />
                </div>
              </div>

              {/* Row 2: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full bg-brand-ivory border border-brand-border rounded-xl px-4 py-2.5 text-base md:text-sm focus:outline-none focus:border-brand-terracotta text-brand-dark"
                    placeholder="yourname@example.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^[0-9+-\s]{10,15}$/,
                        message: "Invalid phone number format"
                      }
                    })}
                    className="w-full bg-brand-ivory border border-brand-border rounded-xl px-4 py-2.5 text-base md:text-sm focus:outline-none focus:border-brand-terracotta text-brand-dark"
                    placeholder={`e.g. ${OFFICE_PHONE}`}
                  />
                  {errors.phone && (
                    <span className="text-xs text-brand-terracotta">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              {/* Row 3: Material Category Selection */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                  Material Classification *
                </label>
                <select
                  {...register("category", { required: "Please select a category" })}
                  className="w-full bg-brand-ivory border border-brand-border rounded-xl px-4 py-2.5 text-base md:text-sm focus:outline-none focus:border-brand-terracotta text-brand-dark font-sans"
                >
                  <option value="">Select Category...</option>
                  {listToRender.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className="text-xs text-brand-terracotta">{errors.category.message}</span>
                )}
              </div>

              {/* Message Details */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-dark uppercase tracking-wider block">
                  Quantity Requirements &amp; Blueprint notes *
                </label>
                <textarea
                  rows={4}
                  {...register("message", { required: "Requirement details are required" })}
                  className="w-full bg-brand-ivory border border-brand-border rounded-xl px-4 py-2.5 text-base md:text-sm focus:outline-none focus:border-brand-terracotta text-brand-dark"
                  placeholder="Specify items: e.g. 5 Tons Tata Tiscon TMT 12mm Rebars, 100 bags Ambuja PPC cement, delivery required at Kashid site..."
                />
                {errors.message && (
                  <span className="text-xs text-brand-terracotta">{errors.message.message}</span>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-4 bg-brand-terracotta hover:bg-brand-terracotta-dark text-brand-ivory rounded-full font-sans font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-sm"
              >
                Send Request
              </button>

            </form>
          </div>

          {/* Right Column: Office info & Map */}
          <div className="space-y-10">
            
            {/* Contact details */}
            <div className="space-y-6">
              <h3 className="font-headings font-bold text-2xl text-brand-dark uppercase tracking-wide">
                Sales &amp; Warehouse
              </h3>
              
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-brand-linen rounded-xl">
                    <FiMapPin className="text-brand-terracotta text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark uppercase text-xs tracking-wider mb-1">Office Address</h4>
                    <p className="text-brand-muted font-light leading-relaxed">
                      {OFFICE_ADDRESS}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-brand-linen rounded-xl">
                    <FiPhone className="text-brand-terracotta text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark uppercase text-xs tracking-wider mb-1">Direct Line</h4>
                    <p className="text-brand-muted font-light">
                      Phone: <a href={`tel:${OFFICE_PHONE.replace(/\s+/g, "")}`} className="hover:text-brand-terracotta font-medium text-brand-dark transition-colors">{OFFICE_PHONE}</a>
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-brand-linen rounded-xl">
                    <FiMail className="text-brand-terracotta text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark uppercase text-xs tracking-wider mb-1">Email Inquiries</h4>
                    <p className="text-brand-muted font-light">
                      <a href={`mailto:${OFFICE_EMAIL}`} className="hover:text-brand-terracotta font-medium text-brand-dark transition-colors">
                        {OFFICE_EMAIL}
                      </a>
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-3 bg-brand-linen rounded-xl">
                    <FiClock className="text-brand-terracotta text-lg" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-dark uppercase text-xs tracking-wider mb-1">Operating Hours</h4>
                    <p className="text-brand-muted font-light">
                      {BUSINESS_HOURS}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* WhatsApp CTA Link */}
            <div className="bg-brand-linen/30 border border-brand-border rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-headings font-bold text-lg text-brand-dark uppercase tracking-wide">Instant Whatsapp Chat</h4>
                <p className="text-xs text-brand-muted font-light">Skip the form and chat directly with our sales coordinator.</p>
              </div>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba56] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
              >
                <RiWhatsappLine className="text-lg" /> Chat Now
              </a>
            </div>

            {/* Google Map Embed */}
            <div className="space-y-4">
              <h4 className="font-headings font-bold text-xs uppercase tracking-widest text-brand-dark">
                Location Map
              </h4>
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden border border-brand-border shadow-sm">
                <iframe
                  src={GOOGLE_MAPS_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mhatre Traders Location Map"
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
