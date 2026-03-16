import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, Check, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const requestTypes = [
  { value: 'city', label: 'City' },
  { value: 'county', label: 'County' }
];

const listTypes = [
  { value: 'code-violations', label: 'Code Violations' },
  { value: 'arrest-records', label: 'Arrest Records' },
  { value: 'fire-damaged', label: 'Fire Damaged Properties' },
  { value: 'water-shutoff', label: 'Water Shut-Off' },
  { value: 'water-lien', label: 'Water Lien' },
  { value: 'tax-delinquencies', label: 'Tax Delinquencies' },
  { value: 'tax-liens', label: 'Tax Liens' },
  { value: 'evictions', label: 'Evictions' },
  { value: 'pre-foreclosures', label: 'Pre-Foreclosures' },
  { value: 'probates', label: 'Probates' }
];

const timeframes = [
  { value: '30-days', label: '30 days' },
  { value: '60-days', label: '60 days' },
  { value: '90-days', label: '90 days' },
  { value: '180-days', label: '180 days' },
  { value: '1-year', label: '1 year' }
];

const getTimeframeLabel = (value, recommended) => {
  const base = timeframes.find(t => t.value === value)?.label || '30 days';
  return recommended === value ? `${base} (recommended)` : base;
};

// Auto-recommend timeframes based on list type
const getRecommendedTimeframe = (listType) => {
  switch (listType) {
    case 'code-violations':
    case 'arrest-records':
    case 'water-shutoff':
    case 'water-lien':
    case 'evictions':
    case 'probates':
    case 'pre-foreclosures':
      return '30-days';
    case 'fire-damaged':
      return '90-days';
    case 'tax-delinquencies':
    case 'tax-liens':
      return '1-year';
    default:
      return '30-days';
  }
};

export default function ScriptGenerator({ isDarkMode }) {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cityCounty, setCityCounty] = useState('');
  const [listType, setListType] = useState('code-violations');
  const [timeframe, setTimeframe] = useState('30-days');
  const [generatedScript, setGeneratedScript] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Format phone number as xxx-xxx-xxxx
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return !match[2] ? match[1] : `${match[1]}-${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    }
    return value;
  };
  
  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };
  
  // Update timeframe when list type changes
  const handleListTypeChange = (value) => {
    setListType(value);
    setTimeframe(getRecommendedTimeframe(value));
  };
  
  const generateScript = (regenerate = false) => {
    if (!fullName) {
      setGeneratedScript(`Please provide your full name to generate the script.`);
      return;
    }
    
    if (!cityCounty) {
      setGeneratedScript(`Please provide a city or county name to generate the script.`);
      return;
    }
    
    const variations = getScriptVariations();
    const index = regenerate ? Math.floor(Math.random() * variations.length) : 0;
    setGeneratedScript(variations[index]());
  };
  
  const getScriptVariations = () => {
    const location = cityCounty;
    const timeframeText = timeframes.find(t => t.value === timeframe)?.label || '30 days';
    
    switch (listType) {
      case 'code-violations':
        return [
          () => `Hello,

I hope this message finds you well. My name is ${fullName}, and I am reaching out to request information about any code violations related to tall grass and trash/debris in ${location} over the past ${timeframeText}. I am conducting research and would greatly appreciate your assistance in providing this information.

If there's a specific department or individual I should reach out to, or if there are forms I need to complete, please let me know so I can ensure the request is properly processed.

Thank you for your time and help.${phoneNumber ? ` If you need any additional information or clarification, feel free to contact me at ${phoneNumber}.` : ''}

Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          
          () => `Good day,

My name is ${fullName}, and I'm writing to inquire about code violation records in ${location}. Specifically, I'm interested in violations concerning overgrown grass and debris/trash accumulation from the last ${timeframeText}. This information will help with my ongoing research project.

Could you please direct me to the appropriate department or provide the necessary forms to complete this request? I want to make sure I follow the correct procedure.

I appreciate your assistance${phoneNumber ? ` and am available at ${phoneNumber} should you need to reach me` : ''}.

Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          
          () => `Hi,

This is ${fullName} reaching out regarding code violations in ${location}. I'm seeking information on violations related to tall grass and trash/debris over the past ${timeframeText} for research purposes.

If there's a particular department handling these requests or any paperwork required, I'd appreciate being pointed in the right direction.

Thanks for your time${phoneNumber ? `. Feel free to contact me at ${phoneNumber} if needed` : ''}.

Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
        ];
      
      case 'arrest-records':
        return [
          () => `Hello,

I hope you're doing well. My name is ${fullName}, and I am writing to request information regarding all arrest records in ${location} within the past ${timeframeText}. I am collecting this information for personal research and would greatly appreciate your assistance in providing the relevant records. Specifically, I am requesting a list of arrests for D.U.I., theft, and assault/battery.

If there is a specific department or individual I should contact, or if there are any forms or procedures I need to follow, please let me know so I can ensure the request is as precise and efficient as possible.

Thank you in advance for your assistance.${phoneNumber ? ` Should you need any additional information, please don't hesitate to reach out to me at ${phoneNumber}.` : ''}

Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Good morning/afternoon,

My name is ${fullName}, and I'm interested in obtaining arrest records for ${location} from the last ${timeframeText}. I'm specifically looking for data on D.U.I., theft, and assault/battery cases for research I'm currently conducting.

Could you please let me know the proper protocol for this request? If there are specific forms or a particular person I should speak with, I'd appreciate that information.

Thanks for your help with this search.${phoneNumber ? ` You can reach me at ${phoneNumber} if you have any questions.` : ''}

Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `To whom it may concern,

I am writing to request a list of arrest records for ${location} over the past ${timeframeText}. This request is for personal research purposes, focusing on incidents involving D.U.I., theft, and assault/battery.

I want to ensure I follow the correct procedure, so please advise on any necessary paperwork or the specific department that handles such requests.

Thank you for your assistance.${phoneNumber ? ` I am available at ${phoneNumber} for any follow-up.` : ''}

Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
        ];
      
      case 'fire-damaged':
        return [
          () => `Hello,

I hope you're doing well. My name is ${fullName}, and I'm writing to request information regarding all fire-damaged properties in ${location} within the past ${timeframeText}. I am gathering this information for personal research and would greatly appreciate your assistance in providing the relevant records.

If there is a specific department or individual I should contact, or if there are any forms or procedures I need to follow, please let me know so I can ensure the request is as specific as possible and help streamline the process.

Thank you in advance for your help.${phoneNumber ? ` Please feel free to reach out to me at ${phoneNumber} if you need any further details.` : ''}

Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Good day,

My name is ${fullName}, and I am conducting research on fire-damaged properties within ${location}. I would like to request a list of properties that have sustained fire damage during the last ${timeframeText}.

Could you please guide me on the process for obtaining these records? If there are specific forms or a department I should contact, please let me know.

I appreciate your time and assistance.${phoneNumber ? ` You can contact me at ${phoneNumber} if needed.` : ''}

Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Hi,

I'm ${fullName}, and I'm currently looking for records of all fire-damaged properties in ${location} from the past ${timeframeText} for research purposes.

If you could point me toward the right department or provide any required forms, I would be very grateful. I want to make sure this request is handled through the proper channels.

Thanks for your time and help.${phoneNumber ? ` Feel free to call me at ${phoneNumber} with any questions.` : ''}

Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
        ];
      
      case 'water-shutoff':
        return [
          () => `Hello,

I hope this message finds you well. My name is ${fullName}, and I am reaching out to request information on all water shut-offs that have occurred in ${location} within the past ${timeframeText}. I am collecting this data for personal research purposes and would greatly appreciate your assistance in obtaining the relevant records.

If there is a specific department or individual I should contact or any forms I need to complete, please let me know so I can ensure the process is as efficient as possible.

Thank you for your time and assistance.${phoneNumber ? ` Feel free to contact me at ${phoneNumber} if you need any additional information or clarification.` : ''}

Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Good morning/afternoon,

My name is ${fullName}, and I am writing to inquire about water shut-off records in ${location} for the last ${timeframeText}. This information is for personal research I am currently performing.

Could you please advise on how I can obtain these records? If there's a specific form or department I should reach out to, please let me know so I can move forward correctly.

Thank you for your help.${phoneNumber ? ` I can be reached at ${phoneNumber} for any further details.` : ''}

Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `To whom it may concern,

This is ${fullName} requesting a list of all water shut-offs in ${location} over the past ${timeframeText}. I'm gathering this data for research purposes and would appreciate your help.

Please let me know the standard procedure for this request and if there are any specific forms I need to fill out.

Thanks for your time.${phoneNumber ? ` My phone number is ${phoneNumber} if you need to contact me.` : ''}

Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
        ];
      
      case 'water-lien':
        return [
          () => `Hello,

I hope this message finds you well. My name is ${fullName}, and I am reaching out to request information on all water liens that have been filed in ${location} within the past ${timeframeText}. I am collecting this data for personal research purposes and would greatly appreciate your assistance in obtaining the relevant records.

If there is a specific department or individual I should contact or any forms I need to complete, please let me know so I can ensure the process is as efficient as possible.

Thank you for your time and assistance.${phoneNumber ? ` Feel free to contact me at ${phoneNumber} if you need any additional information or clarification.` : ''}

Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Good morning/afternoon,

My name is ${fullName}, and I'm interested in obtaining a list of all water liens filed in ${location} over the last ${timeframeText}. This information is needed for research I'm conducting.

Could you please let me know the proper procedure to request these records? If there are specific forms or a department I should contact directly, I'd appreciate those details.

I appreciate your help with this request.${phoneNumber ? ` Feel free to call me at ${phoneNumber} if you have any questions.` : ''}

Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Hi,

I am writing to request information on water liens in ${location} from the past ${timeframeText}. My name is ${fullName}, and I'm gathering this information for research purposes.

Please guide me to the correct department or provide the necessary forms so I can complete this request through the proper channels.

Thank you for your help.${phoneNumber ? ` I'm available at ${phoneNumber} for any follow-up.` : ''}

Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
        ];
      
      case 'tax-delinquencies':
        return [
          () => `Hello,

I hope you're doing well. My name is ${fullName}, and I am writing to request information regarding all tax delinquencies in ${location} over the past ${timeframeText}. I am conducting personal research and would greatly appreciate your help in providing the relevant records.

If there is a specific department or individual I should contact, or if there are any forms or additional steps I need to follow, please let me know so I can ensure the process goes as smoothly as possible.

Thank you in advance for your assistance.${phoneNumber ? ` Please feel free to reach out to me at ${phoneNumber} if you need any further information.` : ''}

Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Good morning/afternoon,

My name is ${fullName}, and I am interested in obtaining records for all tax delinquencies in ${location} from the last ${timeframeText}. This information is for research I am currently working on.

Could you please advise me on the process to request these records? If there are specific forms or a department I should contact, please let me know so I can follow the proper protocol.

Thank you for your help.${phoneNumber ? ` I can be reached at ${phoneNumber} if you have any questions.` : ''}

Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `To whom it may concern,

This is ${fullName}, and I am requesting information on tax delinquencies in ${location} over the past ${timeframeText} for personal research purposes.

If there is a particular department or form I should use for this request, please let me know so I can ensure it is processed correctly.

Thank you for your time and assistance.${phoneNumber ? ` You can contact me at ${phoneNumber} if needed.` : ''}

Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
        ];
      
      case 'tax-liens':
        return [
          () => `Hello,

I hope you're doing well. My name is ${fullName}, and I am writing to request information regarding all tax liens in ${location} over the past ${timeframeText}. I am gathering this data for personal research purposes and would greatly appreciate your assistance in providing the relevant records.

If there is a specific department or individual I should reach out to, or if there are any forms or additional steps needed, please let me know so I can ensure my request is as accurate and efficient as possible.

Thank you in advance for your help.${phoneNumber ? ` Please feel free to contact me at ${phoneNumber} if you need any additional details.` : ''}

Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Good morning/afternoon,

My name is ${fullName}, and I am writing to inquire about tax lien records in ${location} for the last ${timeframeText}. I am conducting research and would like to obtain a list of these filings.

Could you please guide me on the correct procedure for this request? If there are specific forms or a department I should contact, I'd appreciate that information.

Thank you for your assistance.${phoneNumber ? ` You can reach me at ${phoneNumber} if you have any questions.` : ''}

Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Hi,

I'm ${fullName}, and I'm currently looking for a list of all tax liens in ${location} from the past ${timeframeText} for research purposes.

If there's a particular department handling these requests or any paperwork required, I'd appreciate being pointed in the right direction.

Thanks for your help and time.${phoneNumber ? ` Feel free to contact me at ${phoneNumber} for any follow-up.` : ''}

Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
        ];
      
      case 'evictions':
        return [
          () => `Hello,

I hope this message finds you well. My name is ${fullName}, and I'm reaching out to request information regarding all evictions in ${location} that have occurred within the last ${timeframeText}. I am gathering this information for personal research and would greatly appreciate your assistance in providing the relevant records.

If there is a specific department or individual I should contact, or if there are any forms or procedures I need to follow, please let me know to help streamline the process.

Thank you in advance for your time and support.${phoneNumber ? ` Feel free to reach out to me at ${phoneNumber} if you need any further details.` : ''}

Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Good morning/afternoon,

My name is ${fullName}, and I'm writing to request a list of all eviction records in ${location} from the last ${timeframeText}. This information is for research I'm currently conducting.

Could you please advise on how I can obtain these records efficiently? If there are specific forms or a department I should contact, please let me know so I can follow the proper protocol.

Thank you for your assistance.${phoneNumber ? ` I can be reached at ${phoneNumber} if you have any questions.` : ''}

Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `To whom it may concern,

This is ${fullName} requesting information on all evictions in ${location} over the past ${timeframeText}. I am collecting this data for personal research and would appreciate your help.

Please let me know the standard procedure for this request and if there are any specific forms I need to fill out to ensure it's processed correctly.

Thank you for your time.${phoneNumber ? ` My phone number is ${phoneNumber} if you need to reach me.` : ''}

Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
        ];
      
      case 'pre-foreclosures':
        return [
          () => `Hello,

I hope you're doing well. My name is ${fullName}, and I'm writing to request information regarding all pre-foreclosures in ${location} within the last ${timeframeText}. I am gathering this data for personal research and would greatly appreciate your assistance in providing the relevant records.

If there is a specific department or individual I should contact, or if there are any forms or additional steps I need to take, please let me know so I can ensure my request is as accurate and efficient as possible.

Thank you in advance for your help.${phoneNumber ? ` Please feel free to reach out to me at ${phoneNumber} if you need any further details.` : ''}

Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Good day,

My name is ${fullName}, and I'm conducting research on pre-foreclosures in ${location}. I would like to request a list of pre-foreclosure records from the last ${timeframeText}.

Could you please guide me on the process for obtaining these records? If there are specific forms or a department I should contact, please let me know so I can follow the proper procedure.

I appreciate your assistance.${phoneNumber ? ` You can reach me at ${phoneNumber} if you need any follow-up.` : ''}

Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Hi,

I'm ${fullName}, and I am looking for information on all pre-foreclosures in ${location} from the past ${timeframeText} for research purposes.

If you could point me toward the right department or provide any required forms, I would be very grateful. I want to make sure I follow the correct procedure for this request.

Thanks for your time and help.${phoneNumber ? ` Feel free to contact me at ${phoneNumber} if you have any questions.` : ''}

Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
        ];
      
      case 'probates':
        return [
          () => `Hello,

I hope this message finds you well. My name is ${fullName}, and I'm reaching out to request information regarding all probates in ${location} within the last ${timeframeText}. I am conducting personal research and would greatly appreciate your help in providing the relevant records.

If there is a specific department or individual I should contact, or if there are any forms or additional procedures I need to follow, please let me know. I'd like to ensure my request is as clear and efficient as possible.

Thank you in advance for your assistance.${phoneNumber ? ` Please feel free to contact me at ${phoneNumber} if you need any further details.` : ''}

Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `Good morning/afternoon,

My name is ${fullName}, and I'm interested in obtaining probate records for ${location} from the last ${timeframeText}. I'm gathering this information for research I'm currently working on.

Could you please advise on how I can access these records? If there are specific forms or a department I should contact directly, I'd appreciate being pointed in the right direction.

Thank you for your help.${phoneNumber ? ` I can be reached at ${phoneNumber} if you have any questions.` : ''}

Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
          () => `To whom it may concern,

This is ${fullName} requesting a list of all probates in ${location} over the past ${timeframeText} for personal research purposes.

Please let me know the standard procedure for this request and if there are any specific forms I need to fill out to ensure everything is handled correctly.

Thank you for your time and support.${phoneNumber ? ` You can reach me at ${phoneNumber} if you need any follow-up.` : ''}

Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
        ];
      
      default:
        return [() => 'Please select a list type.'];
    }
  };
  
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    toast.success('Script copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <section className={`py-20 transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`} id="script-generator">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className={`text-3xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Script Generator</h2>
          <p className={`transition-colors ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Generate professional scripts for requesting code violation information.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`rounded-2xl p-8 border transition-colors ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="fullName" className={isDarkMode ? 'text-slate-300' : ''}>Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g., John Smith"
                className={isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className={isDarkMode ? 'text-slate-300' : ''}>Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="e.g., 555-123-4567"
                maxLength={12}
                className={isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cityCounty" className={isDarkMode ? 'text-slate-300' : ''}>City / County</Label>
              <Input
                id="cityCounty"
                value={cityCounty}
                onChange={e => setCityCounty(e.target.value)}
                placeholder="e.g., Los Angeles"
                className={isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : ''}
              />
            </div>
            
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-slate-300' : ''}>Type of List</Label>
              <Select value={listType} onValueChange={handleListTypeChange}>
                <SelectTrigger className={isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {listTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-4 items-end">
            <div className="w-1/2 space-y-2">
              <Label className={isDarkMode ? 'text-slate-300' : ''}>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className={`h-12 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map(tf => (
                    <SelectItem key={tf.value} value={tf.value}>
                      {getTimeframeLabel(tf.value, getRecommendedTimeframe(listType))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={() => generateScript(false)}
              className="w-1/2 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Script
            </Button>
          </div>
          
          {generatedScript && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  <span className={`font-semibold transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Generated Script</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateScript(true)}
                    className={`gap-2 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}
                  >
                    <Wand2 className="w-4 h-4" />
                    New Version
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className={`gap-2 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
              <pre className={`rounded-xl p-6 border text-sm whitespace-pre-wrap overflow-x-auto font-mono transition-colors ${
                isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
              }`}>
                {generatedScript}
              </pre>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}