import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, Check, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const requestTypes = [
  { value: 'code-violations', label: 'Code Violations History' },
  { value: 'open-violations', label: 'Open/Active Violations' },
  { value: 'permit-history', label: 'Permit History' },
  { value: 'compliance-status', label: 'Compliance Status' }
];

const timeframes = [
  { value: 'all-time', label: 'All Available History' },
  { value: '5-years', label: 'Last 5 Years' },
  { value: '3-years', label: 'Last 3 Years' },
  { value: '1-year', label: 'Last 1 Year' }
];

export default function ScriptGenerator() {
  const [municipality, setMunicipality] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [requestType, setRequestType] = useState('code-violations');
  const [timeframe, setTimeframe] = useState('all-time');
  const [generatedScript, setGeneratedScript] = useState('');
  const [copied, setCopied] = useState(false);
  
  const generateScript = () => {
    const requestTypeText = requestTypes.find(r => r.value === requestType)?.label || 'code violations history';
    const timeframeText = timeframes.find(t => t.value === timeframe)?.label.toLowerCase() || 'all available history';
    
    const script = `To: ${municipality || '[Municipality Name]'} - Code Enforcement Department
From: [Your Name/Company]
Date: ${new Date().toLocaleDateString()}
Subject: Public Records Request - Code Violation Information

Dear Code Enforcement Department,

I am writing to request public records under the [State] Public Records Act regarding the following property:

Property Address: ${propertyAddress || '[Property Address]'}

I am requesting the following information:
1. ${requestTypeText} for the above-mentioned property
2. Timeframe: ${timeframeText}
3. Include all associated documentation, notices, and correspondence
4. Any open or pending violation cases

Please provide this information in digital format if available. I am willing to pay reasonable copying fees as allowed by law.

Please let me know if you require any additional information to process this request. I look forward to your prompt response.

Sincerely,

[Your Name]
[Your Title]
[Your Company]
[Your Contact Information]`;
    
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
              <Label htmlFor="municipality">Municipality Name</Label>
              <Input
                id="municipality"
                value={municipality}
                onChange={e => setMunicipality(e.target.value)}
                placeholder="e.g., City of Phoenix"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Property Address</Label>
              <Input
                id="address"
                value={propertyAddress}
                onChange={e => setPropertyAddress(e.target.value)}
                placeholder="e.g., 123 Main Street"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Request Type</Label>
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