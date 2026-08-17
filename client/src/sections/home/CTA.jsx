import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiPhone, FiMail } from "react-icons/fi";
import { OFFICE_PHONE, OFFICE_EMAIL } from "../../constants/contact";
import { BASE_URL } from "../../config/api.js";

export default function CTA() {
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

  const onSubmit = async (data) => {
    console.log("Consultation Request:", data);
    try {
      const response = await fetch(`${BASE_URL}/public/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: data.name,
          company: data.company,
          email: data.email,
          phone: data.phone,
          category: data.category,
          message: data.message
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.message || "Failed to submit quotation request");
      }

      toast.success("Thank you! Our Alibaug sales office will send a quote soon.");
      reset();
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to submit quotation request. Please try again.");
    }
  };

  const listToRender = categoriesList.length > 0 ? categoriesList : [
    { id: '1', title: 'Cement & Aggregates' },
    { id: '2', title: 'Structural Steel & Rebars' },
    { id: '3', title: 'Pipes & Fittings' }
  ];

  return (
    <section className="py-16 md:py-18 bg-brand-linen border-b border-brand-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Enquiry Section: Two-Column Consultation Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Heading and Contact details */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <span className="text-[13px] text-brand-terracotta font-sans font-medium tracking-widest uppercase block">
              GET IN TOUCH
            </span>
            <h2 className="font-headings font-semibold text-3xl md:text-[38px] tracking-tight leading-[1.2] text-brand-dark">
              Request a <br /> Material <br /> Quotation
            </h2>
            <p className="text-[13px] text-brand-muted font-normal max-w-sm leading-relaxed font-sans">
              Need construction materials for your home, shop, office, or project? Share your requirements and our team will get back to you with the best quotation and product recommendations.
            </p>
            
            <div className="pt-2 space-y-3 text-[13px] font-sans font-medium text-brand-dark">
              <div className="flex items-center gap-2.5">
                <FiPhone className="text-base text-brand-terracotta" />
                <a href={`tel:${OFFICE_PHONE.replace(/\s+/g, "")}`} className="hover:underline transition-all">
                  {OFFICE_PHONE}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <FiMail className="text-base text-brand-terracotta" />
                <a href={`mailto:${OFFICE_EMAIL}`} className="hover:underline transition-all">
                  {OFFICE_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Centered White Enquiry Card with soft shadow */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-brand-border shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              
              {/* Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    {...register("name", { required: true })}
                    className="w-full bg-brand-linen/50 border border-brand-border rounded-lg px-3.5 py-2 text-base md:text-[13px] focus:outline-none focus:border-brand-terracotta text-brand-dark font-sans placeholder:text-brand-muted/50"
                  />
                  {errors.name && <span className="text-[10px] text-brand-terracotta">Required</span>}
                </div>
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Company / Contractor"
                    {...register("company")}
                    className="w-full bg-brand-linen/50 border border-brand-border rounded-lg px-3.5 py-2 text-base md:text-[13px] focus:outline-none focus:border-brand-terracotta text-brand-dark font-sans placeholder:text-brand-muted/50"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <input
                    type="email"
                    placeholder="Email Address"
                    {...register("email")}
                    className="w-full bg-brand-linen/50 border border-brand-border rounded-lg px-3.5 py-2 text-base md:text-[13px] focus:outline-none focus:border-brand-terracotta text-brand-dark font-sans placeholder:text-brand-muted/50"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    {...register("phone", { required: true })}
                    className="w-full bg-brand-linen/50 border border-brand-border rounded-lg px-3.5 py-2 text-base md:text-[13px] focus:outline-none focus:border-brand-terracotta text-brand-dark font-sans placeholder:text-brand-muted/50"
                  />
                  {errors.phone && <span className="text-[10px] text-brand-terracotta">Required</span>}
                </div>
              </div>

              {/* Category Select */}
              <div className="space-y-1">
                <select
                  {...register("category", { required: true })}
                  className="w-full bg-brand-linen/50 border border-brand-border rounded-lg px-3.5 py-2 text-base md:text-[13px] focus:outline-none focus:border-[#B56A45] text-brand-dark font-sans"
                >
                  <option value="">Select Division *</option>
                  {listToRender.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="text-[10px] text-brand-terracotta">Required</span>}
              </div>

              {/* Message Area */}
              <div className="space-y-1">
                <textarea
                  placeholder="What materials do you need? (e.g. 5 MT Tata Steel, 200 Bags Cement)*"
                  rows={3}
                  {...register("message", { required: true })}
                  className="w-full bg-brand-linen/50 border border-brand-border rounded-lg px-3.5 py-2 text-base md:text-[13px] focus:outline-none focus:border-brand-terracotta text-brand-dark font-sans placeholder:text-brand-muted/50"
                />
                {errors.message && <span className="text-[10px] text-brand-terracotta">Required</span>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-2.5 bg-brand-terracotta hover:bg-brand-terracotta-dark text-white rounded-lg font-sans font-semibold text-[13px] tracking-wide transition-all duration-300 cursor-pointer"
              >
                Send a Quotation Request
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
