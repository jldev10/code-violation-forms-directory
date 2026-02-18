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
  { value: 'water-lien', label: 'Water Lien/Shut-Off' },
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

export default function ScriptGenerator() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [requestType, setRequestType] = useState('city');
  const [listType, setListType] = useState('code-violations');
  const [timeframe, setTimeframe] = useState('30-days');
  const [generatedScript, setGeneratedScript] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Update timeframe when list type changes
  const handleListTypeChange = (value) => {
    setListType(value);
    setTimeframe(getRecommendedTimeframe(value));
  };
  
  const generateScript = (regenerate = false) => {
    if (listType === 'code-violations') {
      generateCodeViolationScript(regenerate);
    } else {
      generateGenericScript();
    }
  };
  
  const generateCodeViolationScript = (regenerate = false) => {
    const requestTypeText = requestTypes.find(r => r.value === requestType)?.label || 'City';
    const timeframeText = timeframes.find(t => t.value === timeframe)?.label || '30 days';
    
    // Multiple variations for code violations
    const variations = [
      // Variation 1
      () => `Hello,
I hope this message finds you well. My name is ${fullName}${phoneNumber ? `, and I am reaching out to request information about any code violations related to tall grass and trash/debris in ${requestTypeText} over the past ${timeframeText}` : ` and I am reaching out to request information about any code violations related to tall grass and trash/debris in ${requestTypeText} over the past ${timeframeText}`}. I am conducting research and would greatly appreciate your assistance in providing this information.
If there's a specific department or individual I should reach out to, or if there are forms I need to complete, please let me know so I can ensure the request is properly processed.
Thank you for your time and help.${phoneNumber ? ` If you need any additional information or clarification, feel free to contact me at ${phoneNumber}.` : ''}
Best regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
      
      // Variation 2
      () => `Good day,
My name is ${fullName}, and I'm writing to inquire about code violation records in ${requestTypeText}. Specifically, I'm interested in violations concerning overgrown grass and debris/trash accumulation from the last ${timeframeText}. This information will help with my ongoing research project.
Could you please direct me to the appropriate department or provide the necessary forms to complete this request? I want to make sure I follow the correct procedure.
I appreciate your assistance${phoneNumber ? ` and am available at ${phoneNumber} should you need to reach me` : ''}.
Sincerely,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
      
      // Variation 3
      () => `Hello there,
I'm ${fullName}, and I'd like to request records of code violations in ${requestTypeText} for the past ${timeframeText}. I'm particularly looking for cases involving tall grass and trash or debris violations as part of my research efforts.
Please let me know if there's a specific process I should follow or any forms that need to be filled out to obtain this information.
Thank you so much for your help${phoneNumber ? `. You can reach me at ${phoneNumber} if you have any questions` : ''}.
Warm regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
      
      // Variation 4
      () => `Hi,
This is ${fullName} reaching out regarding code violations in ${requestTypeText}. I'm seeking information on violations related to tall grass and trash/debris over the past ${timeframeText} for research purposes.
If there's a particular department handling these requests or any paperwork required, I'd appreciate being pointed in the right direction.
Thanks for your time${phoneNumber ? `. Feel free to contact me at ${phoneNumber} if needed` : ''}.
Best,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`,
      
      // Variation 5
      () => `Greetings,
My name is ${fullName}, and I am requesting access to code violation records for ${requestTypeText} covering the last ${timeframeText}. I'm specifically interested in violations pertaining to overgrown grass and trash or debris accumulation for my research.
Could you guide me on the proper channels or forms needed to process this request?
I'm grateful for your assistance${phoneNumber ? ` and can be reached at ${phoneNumber} for any follow-up` : ''}.
Kind regards,
${fullName}${phoneNumber ? `\n${phoneNumber}` : ''}`
    ];
    
    // If regenerating, pick a random variation, otherwise use variation 0
    const index = regenerate ? Math.floor(Math.random() * variations.length) : 0;
    
    // If no name provided, use placeholder
    if (!fullName) {
      setGeneratedScript(`Please provide your full name to generate the script.`);
      return;
    }
    
    setGeneratedScript(variations[index]());
  };
  
  const generateGenericScript = () => {
    const requestTypeText = requestTypes.find(r => r.value === requestType)?.label || 'City';
    const listTypeText = listTypes.find(l => l.value === listType)?.label || 'Code Violations';
    const timeframeText = timeframes.find(t => t.value === timeframe)?.label || '30 days';
    
    const script = `To: ${requestTypeText} Records Department
From: ${fullName || '[Your Full Name]'}${phoneNumber ? `\nPhone: ${phoneNumber}` : ''}
Date: ${new Date().toLocaleDateString()}
Subject: Public Records Request - ${listTypeText} Information

Dear Records Department,

I am writing to request public records under the [State] Public Records Act.

Request Details:
- Full Name: ${fullName || '[Your Full Name]'}${phoneNumber ? `\n- Phone Number: ${phoneNumber}` : ''}
- ${requestTypeText}: [${requestTypeText} Name]
- Record Type: ${listTypeText}
- Timeframe: ${timeframeText}

I am requesting copies of all ${listTypeText.toLowerCase()} reports, notices, and related documentation for the above-specified timeframe. Please provide these records in electronic format if possible.

If there are any fees associated with this request, please notify me in advance. If you need any additional information to process this request, please contact me at your earliest convenience.

Thank you for your assistance.

Sincerely,

${fullName || '[Your Full Name]'}${phoneNumber ? `\n${phoneNumber}` : ''}`;
    
    setGeneratedScript(script);
  };
  
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    toast.success('Script copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <section className="py-20 bg-white" id="script-generator">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Script Generator</h2>
          <p className="text-slate-600">Generate professional scripts for requesting code violation information.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-slate-50 rounded-2xl p-8 border border-slate-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g., John Smith"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                placeholder="e.g., (555) 123-4567"
              />
            </div>
            
            <div className="space-y-2">
              <Label>City / County</Label>
              <Select value={requestType} onValueChange={setRequestType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {requestTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Type of List</Label>
              <Select value={listType} onValueChange={handleListTypeChange}>
                <SelectTrigger>
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
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="h-12">
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
                  <span className="font-semibold text-slate-900">Generated Script</span>
                </div>
                <div className="flex gap-2">
                  {listType === 'code-violations' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateScript(true)}
                      className="gap-2"
                    >
                      <Wand2 className="w-4 h-4" />
                      New Version
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>
              <pre className="bg-white rounded-xl p-6 border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap overflow-x-auto font-mono">
                {generatedScript}
              </pre>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}