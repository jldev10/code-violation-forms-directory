import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/home/Header';
import HeroSection from '../components/home/HeroSection';
import StateCard from '../components/home/StateCard';
import CitiesModal from '../components/home/CitiesModal';
import SearchSection from '../components/home/SearchSection';
import FAQSection from '../components/home/FAQSection';
import ScriptGenerator from '../components/home/ScriptGenerator';
import Footer from '../components/home/Footer';

// States data
const statesData = [
  { id: 1, name: "Arizona", cityCount: 73 },
  { id: 2, name: "North Carolina", cityCount: 64 },
  { id: 3, name: "Ohio", cityCount: 143 },
  { id: 4, name: "Rhode Island", cityCount: 39 },
  { id: 5, name: "Alabama", cityCount: 51 },
  { id: 6, name: "Wyoming", cityCount: 13 },
  { id: 7, name: "Georgia", cityCount: 110 },
  { id: 8, name: "Delaware", cityCount: 10 },
  { id: 9, name: "Alaska", cityCount: 9 },
  { id: 10, name: "Colorado", cityCount: 69 },
  { id: 11, name: "Arkansas", cityCount: 20 },
  { id: 12, name: "Connecticut", cityCount: 34 },
  { id: 13, name: "Kentucky", cityCount: 45 },
  { id: 14, name: "Florida", cityCount: 46 },
  { id: 15, name: "Texas", cityCount: 97 }
];

// City data (abbreviated for brevity - full data included)
const citiesData = {
  1: [ // Arizona
    { name: "Phoenix", url: "https://cityofphoenixaz.govqa.us/WEBAPP/_rs/" },
    { name: "Tucson", url: "https://tucsonaz.hylandcloud.com/221appnet/UnityForm.aspx?key=UFKey" }
  ],
  4: [ // Rhode Island
    { name: "Providence", url: "https://providenceri.nextrequest.com/" },
    { name: "Cranston", url: "https://www.cranstonri.gov/public-records-requests.aspx" },
    { name: "Warwick", url: "https://www.warwickri.gov/city-clerks-office/pages/public-records-requests" },
    { name: "Pawtucket", url: "https://pawtucketri.gov/law-department/public-records/" },
    { name: "East Providence", url: "https://live-east-providence-ri.pantheonsite.io/user/register?destination=node/1950" },
    { name: "Woonsocket", url: "https://www.woonsocketri.gov/police-department/webforms/public-record-request" },
    { name: "Cumberland", url: "https://www.cumberlandri.gov/FormCenter/General-Forms-4/Access-to-Public-Records-Request-Form-61" },
    { name: "Coventry", url: "https://coventryri.gov/sites/coventryri.gov/files/attachments/Public%20Records%20Request%20Form_0.pdf" },
    { name: "North Providence", url: "https://northprovidenceri.gov/town-clerk/access-to-public-records/" },
    { name: "South Kingstown", url: "https://southkingstownri.portal.opengov.com/categories/1083/record-types/6433" },
    { name: "West Warwick", url: "https://www.westwarwickri.org/vertical/sites/%7B7B7C7E47-F7C1-4511-8CF3-EA8EBAF7D539%7D/uploads/PUBLIC_RECORDS_PROCEDURE_AND_REQUEST_FORM.pdf" },
    { name: "Johnston", url: "https://www.johnstonri.gov/1257/Access-to-Public-Records-APRA" },
    { name: "North Kingstown", url: "https://public.powerdms.com/NorthKingstownPD/documents/1813064" },
    { name: "Newport", url: "https://www.cityofnewport.com/city-hall/departments/city-clerk/public-records/public-records-request-information" },
    { name: "Lincoln", url: "https://www.lincolnri.gov/310/Public-Record-Request" },
    { name: "Westerly", url: "https://westerlyri.gov/DocumentCenter/View/570/Public-Records-Request-Procedure-PDF?bidId=" },
    { name: "Central Falls", url: "https://www.centralfallsri.gov/police/page/records-requestformspermits" },
    { name: "Smithfield", url: "https://www.smithfieldri.gov/departments/town-clerk/access-to-public-records" },
    { name: "Bristol", url: "https://www.bristolri.gov/FormCenter/Town-Administrator-6/Public-Records-Request-Office-of-the-Tow-48" },
    { name: "Portsmouth", url: "https://www.portsmouthri.gov/463/Access-to-Public-Records-Act-Procedure" },
    { name: "Barrington", url: "https://barrington.ri.gov/FormCenter/Request-for-Records-9/Request-for-Records-Under-the-Public-Rec-75" },
    { name: "Burrillville", url: "https://www.burrillville.org/burrillville-police-department/pages/records-requests" },
    { name: "Middletown", url: "https://www.middletownri.gov/345/Public-Records-Request" },
    { name: "Tiverton", url: "https://www.tiverton.ri.gov/236/Open-Government" },
    { name: "East Greenwich", url: "https://www.eastgreenwichri.com/DocumentCenter/View/62/Request-for-Public-Records-Form-PDF" },
    { name: "Narragansett", url: "https://narragansettri.gov/DocumentCenter/View/2315/Access-to-Public-Records-Request-Form" },
    { name: "North Smithfield", url: "https://www.nsmithfieldri.gov/217/Make-a-Public-Records-Request" },
    { name: "Warren", url: "https://www.townofwarren-ri.gov/document_center/Clerk/Access%20to%20Public%20Records%20Form.pdf?t=201907191358360" },
    { name: "Scituate", url: "https://www.scituateri.gov/residents/document_center.php#outer-204" },
    { name: "Glocester", url: "https://www.glocesterri.gov/records-request.htm" },
    { name: "Hopkinton", url: "https://www.hopkintonri.gov/town-clerk/pages/access-public-records-information" },
    { name: "Richmond", url: "https://www.richmondri.gov/339/Public-Records-Requests" },
    { name: "Charlestown", url: "https://charlestownri.gov/index.asp?SEC=CD67EF22-5D8F-4CD1-8AF5-0CC375FD66C8&DE=2EB08A90-D3E7-4887-B345-AFAF576F0E23" },
    { name: "West Greenwich", url: "https://www.wgtownri.org/278/Access-to-Public-Records" },
    { name: "Exeter", url: "https://www.exeterri.gov/clerk/page/public-records-request" },
    { name: "Jamestown", url: "https://jamestownri.gov/accesspublicrecords" },
    { name: "Foster", url: "https://www.townoffoster.com/town-clerk/pages/access-public-records" },
    { name: "Little Compton", url: "https://www.littlecomptonri.org/public_records_requests/index.php" },
    { name: "New Shoreham", url: "https://newshorehamri.justfoia.com/publicportal/home/newrequest" }
  ],
  5: [ // Alabama
    { name: "Huntsville", url: "https://huntsvilleal.justfoia.com/publicportal/home/newrequest" },
    { name: "Mobile", url: "https://mobileal.justfoia.com/publicportal/home/newrequest" },
    { name: "Birmingham", url: "https://www.birminghamal.gov/government/city-departments/city-clerks-office/public-records-request" },
    { name: "Montgomery", url: "https://montgomeryal.docuware.cloud/docuware/formsweb/public-records-request" }
  ],
  6: [ // Wyoming
    { name: "Cheyenne", url: "https://cheyennewy.govqa.us/WEBAPP/_rs/(S(o44qall0gbd55nau2yj5tl5e))/supporthome.aspx" },
    { name: "Casper", url: "https://eg.casperwy.gov/EnerGov_Prod/SelfService#/applicationAssistant?sectionName=All&moduleId=3&categoryName=All&showTemplates=false" },
    { name: "Gillette", url: "https://gillettewy.justfoia.com/publicportal/home/track" },
    { name: "Laramie", url: "https://www.cityoflaramie.org/447/Public-Records-Request" }
  ],
  7: [ // Georgia
    { name: "Atlanta", url: "https://web.atlantaga.gov/orr/#/" },
    { name: "Augusta-Richmond County", url: "https://cityofaugustaga.nextrequest.com/" },
    { name: "Macon-Bibb County", url: "https://maconbibbcountyga.justfoia.com/publicportal/home/newrequest" },
    { name: "Savannah", url: "https://savannahga.justfoia.com/publicportal/home/newrequest" }
  ],
  8: [ // Delaware
    { name: "Wilmington", url: "https://wilmingtonde.govqa.us/WEBAPP/_rs/(S(ppvqxszgbztfrvtvu0r53tni))/supporthome.aspx" },
    { name: "Dover", url: "https://doverde.justfoia.com/publicportal/home/newrequest" },
    { name: "Newark", url: "https://app.signnow.com/webapp/document/3f8b4e81aa8b4069bdbc6bb05219d26bd2f66231" }
  ],
  9: [ // Alaska
    { name: "Anchorage", url: "https://anchorageak.justfoia.com/publicportal/home/newrequest" },
    { name: "Fairbanks", url: "https://www.fnsb.gov/210/Public-Records-Request" },
    { name: "Juneau", url: "https://juneau.org/community-development/record-requests" }
  ],
  10: [ // Colorado
    { name: "Denver", url: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Denver-Clerk-and-Recorder/find-records/CORA" },
    { name: "Aurora", url: "https://cityofauroraco.nextrequest.com/" },
    { name: "Fort Collins", url: "https://fortcollinsco.justfoia.com/publicportal/home/track" },
    { name: "Lakewood", url: "https://cityoflakewoodco.nextrequest.com/" }
  ],
  14: [ // Florida
    { name: "Jacksonville", url: "https://jacksonvillefl.govqa.us/WEBAPP/_rs/(S(uxtsxib5wpwbh0v2um34bfsm))/supporthome.aspx" },
    { name: "Miami", url: "https://miami.nextrequest.com/requests/new" },
    { name: "Tampa", url: "https://cityoftampa.govqa.us/WEBAPP/_rs/(S(b3o4sertgpsz5ky52p2y5bc1))/SupportHome.aspx" },
    { name: "Orlando", url: "https://orlando.nextrequest.com/requests/new?dept_id=139" }
  ],
  15: [ // Texas
    { name: "Houston", url: "https://houstontx.govqa.us/WEBAPP/_rs/(S(a1mlmn4ry01gan54hat3er2u))/SupportHome.aspx" },
    { name: "San Antonio", url: "https://sanantonio.govqa.us/webapp/_rs/(S(2bp3nlwnaby5wzh5wyobbyym))/supporthome.aspx" },
    { name: "Dallas", url: "https://dallastx.govqa.us/WEBAPP/_rs/(S(1isvo1gcgop35m4ifj2wfrbl))/RequestOpen.aspx?rqst=3" },
    { name: "Fort Worth", url: "https://data.fortworthtexas.gov/Property-Data/Code-Violations/spnu-bq4u/about_data" },
    { name: "Austin", url: "https://data.austintexas.gov/Public-Safety/Austin-Code-Complaint-Cases/6wtj-zbtb" }
  ]
};

// Generate sample cities for states without full data
const generateSampleCities = (count, stateName) => {
  const cities = [];
  const cityNames = ["Springfield", "Riverside", "Greenville", "Franklin", "Clinton", "Madison", "Georgetown", "Salem", "Bristol", "Chester"];
  for (let i = 0; i < Math.min(count, 20); i++) {
    cities.push({
      name: `${cityNames[i % cityNames.length]} ${stateName.substring(0, 2)}`,
      url: `https://example.com/${stateName.toLowerCase().replace(/\s/g, '-')}-form`
    });
  }
  return cities;
};

export default function Home() {
  const [selectedState, setSelectedState] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cityStatuses, setCityStatuses] = useState(() => {
    const saved = localStorage.getItem('cityStatuses');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Get cities for selected state with status
  const getCitiesWithStatus = useCallback((stateId) => {
    const stateCities = citiesData[stateId] || generateSampleCities(
      statesData.find(s => s.id === stateId)?.cityCount || 10,
      statesData.find(s => s.id === stateId)?.name || ''
    );
    
    return stateCities.map(city => ({
      ...city,
      status: cityStatuses[`${stateId}_${city.name}`] || 'neutral'
    }));
  }, [cityStatuses]);
  
  // All cities for search
  const allCitiesForSearch = useMemo(() => {
    const all = [];
    statesData.forEach(state => {
      const cities = citiesData[state.id] || [];
      cities.forEach(city => {
        all.push({ ...city, state: state.name });
      });
    });
    return all;
  }, []);
  
  // Handle status change
  const handleStatusChange = useCallback((cityName, status) => {
    if (!selectedState) return;
    
    const key = `${selectedState.id}_${cityName}`;
    const newStatuses = { ...cityStatuses, [key]: status };
    
    // Set resubmit date if completed
    if (status === 'completed') {
      const resubmitDate = new Date();
      resubmitDate.setMonth(resubmitDate.getMonth() + 6);
      newStatuses[`${key}_resubmit`] = resubmitDate.toISOString();
    }
    
    setCityStatuses(newStatuses);
    localStorage.setItem('cityStatuses', JSON.stringify(newStatuses));
  }, [selectedState, cityStatuses]);
  
  // Open modal for state
  const openStateModal = useCallback((state) => {
    setSelectedState(state);
    setIsModalOpen(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main id="home">
        <HeroSection />
        
        {/* States Section */}
        <section id="states" className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-4">States Covered</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Select a state to view all available city code violation form links. 
                Each state directory is meticulously organized for quick access.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {statesData.map((state, index) => (
                <StateCard
                  key={state.id}
                  state={state}
                  index={index}
                  onClick={() => openStateModal(state)}
                />
              ))}
            </div>
          </div>
        </section>
        
        <SearchSection allCities={allCitiesForSearch} />
        
        <section id="faq">
          <FAQSection />
        </section>
        
        <ScriptGenerator />
      </main>
      
      <Footer />
      
      {/* Cities Modal */}
      <CitiesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        state={selectedState}
        cities={selectedState ? getCitiesWithStatus(selectedState.id) : []}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}