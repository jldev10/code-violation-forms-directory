import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, ChevronRight } from 'lucide-react';

const faqs = [
  {
    question: "What is a code violation form?",
    answer: "A code violation form is an official document used to report violations of municipal codes, such as building code violations, zoning issues, property maintenance problems, and other local ordinance violations."
  },
  {
    question: "How often should I resubmit requests?",
    answer: "We recommend resubmitting code violation information requests every 30 days to ensure you have the most current data. The system will automatically remind you when it's time to resubmit."
  },
  {
    question: "What do the status colors mean?",
    answer: "Pending (yellow): Form has been requested but not yet received. Completed (green): Form has been received and processed. Resubmit (red): It's time to request updated information (6 months have passed). Neutral (clear circle): No action taken yet."
  },
  {
    question: "How do I find the forms to the city I want?",
    answer: "We provide forms in multiple cities in 15 states, not all cities in those states. Click on view cities & forms, find the city you want, and click on view form and it will send you straight to the website to request the form or the pdf form so you can print it out to be able to fill it out to email to the city."
  }
];

export default function FAQSection({ isDarkMode }) {
  return (
    <section className={`py-20 transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Frequently Asked Questions</h2>
          <p className={`transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Find answers to common questions about using our directory.</p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-xl p-6 border shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200 ${
                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className={`font-semibold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{faq.question}</h3>
                  <p className={`leading-relaxed transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}