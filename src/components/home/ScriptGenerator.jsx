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

const timeframes = [
  { value: '30-days', label: '30 days (Recommended)' },
  { value: '60-days', label: '60 days' },
  { value: '90-days', label: '90 days' },
  { value: '180-days', label: '180 days' },
  { value: '1-year', label: '1 year' }
];

export default function ScriptGenerator() {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [requestType, setRequestType] = useState('city');
  const [timeframe, setTimeframe] = useState('30-days');
  const [generatedScript, setGeneratedScript] = useState('');
  const [copied, setCopied] = useState(false);
  
  const generateScript = () => {
    const requestTypeText = requestTypes.find(r => r.value === requestType)?.label || 'City';
    const timeframeText = timeframes.find(t => t.value === timeframe)?.label || '30 days (Recommended)';
    
    const script = `To: ${requestTypeText} Code Enforcement Department
From: ${fullName || '[Your Full Name]'}
Phone: ${phoneNumber || '[Your Phone Number]'}
Date: ${new Date().toLocaleDateString()}
Subject: Public Records Request - Code Violation Information

Dear Code Enforcement Department,

I am writing to request public records under the [State] Public Records Act.

Request Details:
- Full Name: ${fullName || '[Your Full Name]'}
- Phone Number: ${phoneNumber || '[Your Phone Number]'}
- ${requestTypeText}: [${requestTypeText} Name]
- Timeframe: ${timeframeText}

I am requesting copies of all code violation reports, notices, and related documentation for the above-specified timeframe. Please provide these records in electronic format if possible.

If there are any fees associated with this request, please notify me in advance. If you need any additional information to process this request, please contact me at your earliest convenience.

Thank you for your assistance.

Sincerely,

${fullName || '[Your Full Name]'}
${phoneNumber || '[Your Phone Number]'}`;
    
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
              <Label>Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map(tf => (
                    <SelectItem key={tf.value} value={tf.value}>{tf.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={generateScript}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-6"
          >
            <Wand2 className="w-5 h-5 mr-2" />
            Generate Script
          </Button>
          
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