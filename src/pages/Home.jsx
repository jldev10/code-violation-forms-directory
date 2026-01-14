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

// Full city data for all states
const citiesData = {
  1: [ // Arizona (73 cities - will need to be populated with actual data)
    { name: "Phoenix", url: "https://cityofphoenixaz.govqa.us/WEBAPP/_rs/" },
    { name: "Tucson", url: "https://tucsonaz.hylandcloud.com/221appnet/UnityForm.aspx?key=UFKey" }
  ],
  2: [ // North Carolina (64 cities - will need to be populated)
    { name: "Charlotte", url: "https://charlottenc.justfoia.com/publicportal/home/newrequest" },
    { name: "Raleigh", url: "https://raleighnc.nextrequest.com/requests/new" }
  ],
  3: [ // Ohio (143 cities - will need to be populated)
    { name: "Columbus", url: "https://portal.columbus.gov/permits/Cap/CapHome.aspx?module=Enforcement" },
    { name: "Cleveland", url: "https://clevelandoh.govqa.us/WEBAPP/_rs/(S(nahoggl3viu2f0np00v4aksw))/supporthome.aspx" }
  ],
  4: [ // Rhode Island (39 cities - COMPLETE)
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
  5: [ // Alabama (51 cities - will populate with sample for now)
    { name: "Huntsville", url: "https://huntsvilleal.justfoia.com/publicportal/home/newrequest" },
    { name: "Mobile", url: "https://mobileal.justfoia.com/publicportal/home/newrequest" },
    { name: "Birmingham", url: "https://www.birminghamal.gov/government/city-departments/city-clerks-office/public-records-request" },
    { name: "Montgomery", url: "https://montgomeryal.docuware.cloud/docuware/formsweb/public-records-request" },
    { name: "Tuscaloosa", url: "https://www.tuscaloosa.com/government/city-clerk/public-records-request" },
    { name: "Hoover", url: "https://www.hooveralabama.gov/FormCenter/Public-Records-17/PUBLIC-RECORDS-REQUEST-87" },
    { name: "Auburn", url: "https://www.auburnal.gov/public-records-request/" },
    { name: "Dothan", url: "https://www.dothan.org/210/Records-Searches" },
    { name: "Madison", url: "https://madisonal.justfoia.com/publicportal/home/newrequest" },
    { name: "Decatur", url: "https://cityofdecatural.justfoia.com/publicportal/home/newrequest" }
  ],
  6: [ // Wyoming (13 cities - COMPLETE)
    { name: "Cheyenne", url: "https://cheyennewy.govqa.us/WEBAPP/_rs/(S(o44qall0gbd55nau2yj5tl5e))/supporthome.aspx" },
    { name: "Casper", url: "https://eg.casperwy.gov/EnerGov_Prod/SelfService#/applicationAssistant?sectionName=All&moduleId=3&categoryName=All&showTemplates=false" },
    { name: "Gillette", url: "https://gillettewy.justfoia.com/publicportal/home/track" },
    { name: "Laramie", url: "https://www.cityoflaramie.org/447/Public-Records-Request" },
    { name: "Sheridan", url: "https://cityofsheridanwy.nextrequest.com/" },
    { name: "Green River", url: "https://www.grwyo.org/219/Records" },
    { name: "Cody", url: "https://codywy.nextrequest.com/" },
    { name: "Rawlins", url: "https://www.rawlinswy.gov/1401/Public-Records-Request" },
    { name: "Lander", url: "https://www.landerwy.gov/media/2756" },
    { name: "Douglas", url: "https://www.cityofdouglas.org/forms.aspx?FID=68" },
    { name: "Torrington", url: "https://www.torringtonwy.gov/DocumentCenter/View/100/Public-Records-Request-Form-PDF" },
    { name: "Buffalo", url: "https://www.cityofbuffalowy.com/files/documents/PublicRecordsRequest1312120613061521PM.pdf" },
    { name: "Mills", url: "https://www.millswy.gov/administration/page/wyoming-public-records-act-requests-foia" }
  ],
  7: [ // Georgia (110 cities - will populate sample)
    { name: "Atlanta", url: "https://web.atlantaga.gov/orr/#/" },
    { name: "Augusta-Richmond County", url: "https://cityofaugustaga.nextrequest.com/" },
    { name: "Macon-Bibb County", url: "https://maconbibbcountyga.justfoia.com/publicportal/home/newrequest" },
    { name: "Savannah", url: "https://savannahga.justfoia.com/publicportal/home/newrequest" },
    { name: "Athens-Clarke County", url: "https://accpd.govqa.us/WEBAPP/_rs/(S(nytqy5q1ub5y3u0u5o434aso))/supporthome.aspx" },
    { name: "South Fulton", url: "https://southfultonga.govqa.us/WEBAPP/_rs/(S(phue3gdewj0w4e10jjsc52c1))/SupportHome.aspx" },
    { name: "Sandy Springs", url: "https://sandyspringsga.justfoia.com/publicportal/home/newrequest" },
    { name: "Roswell", url: "https://roswellga.justfoia.com/Forms/Launch/d705cbd6-1396-49b7-939e-8d86c5a87deb" },
    { name: "Warner Robins", url: "https://warnerrobins.justfoia.com/publicportal/home/track" },
    { name: "Johns Creek", url: "https://johnscreekga.govqa.us/WEBAPP/_rs/(S(meegfvznljw4tzgcttavdunm))/supporthome.aspx" }
  ],
  8: [ // Delaware (10 cities - COMPLETE)
    { name: "Wilmington", url: "https://wilmingtonde.govqa.us/WEBAPP/_rs/(S(ppvqxszgbztfrvtvu0r53tni))/supporthome.aspx" },
    { name: "Dover", url: "https://doverde.justfoia.com/publicportal/home/newrequest" },
    { name: "Newark", url: "https://app.signnow.com/webapp/document/3f8b4e81aa8b4069bdbc6bb05219d26bd2f66231" },
    { name: "Middletown", url: "https://www.middletown.delaware.gov/media/FOIA%20Document%20Request.pdf" },
    { name: "Milford", url: "https://www.cityofmilford.com/FormCenter/Milford-Forms-2/Request-for-Public-Records-36" },
    { name: "Smyrna", url: "https://townofsmyrna.seamlessdocs.com/f/foiarequest" },
    { name: "Seaford", url: "https://www.seafordde.com/government/f_o_i_a_request" },
    { name: "Georgetown", url: "https://www.georgetowndel.com/foia-request.htm" },
    { name: "Millsboro", url: "https://www.millsboro.org/government/freedom_of_information_act.php" },
    { name: "Elsmere", url: "https://townofelsmere.com/departments/foia/" }
  ],
  9: [ // Alaska (9 cities - COMPLETE)
    { name: "Anchorage", url: "https://anchorageak.justfoia.com/publicportal/home/newrequest" },
    { name: "Fairbanks", url: "https://www.fnsb.gov/210/Public-Records-Request" },
    { name: "Juneau", url: "https://juneau.org/community-development/record-requests" },
    { name: "Wasilla", url: "https://www.cityofwasilla.gov/490/Public-Records-Requests-for-General-Reco" },
    { name: "Sitka", url: "https://www.cityofsitka.com/municipal-records" },
    { name: "Palmer", url: "https://palmerak.civicpluswebopen.com/media/29086" },
    { name: "Bethel", url: "https://cityofbethel-services.app.transform.civicplus.com/forms/40707" },
    { name: "Homer", url: "https://www.cityofhomer-ak.gov/cityclerk/public-records-0" },
    { name: "Kodiak", url: "https://www.city.kodiak.ak.us/cityclerk/page/public-records-request-form" }
  ],
  10: [ // Colorado (69 cities - will populate sample)
    { name: "Denver", url: "https://www.denvergov.org/Government/Agencies-Departments-Offices/Agencies-Departments-Offices-Directory/Denver-Clerk-and-Recorder/find-records/CORA" },
    { name: "Aurora", url: "https://cityofauroraco.nextrequest.com/" },
    { name: "Fort Collins", url: "https://fortcollinsco.justfoia.com/publicportal/home/track" },
    { name: "Lakewood", url: "https://cityoflakewoodco.nextrequest.com/" },
    { name: "Thornton", url: "https://forms.thorntonco.gov/CityClerk/RequestForPublicRecords" },
    { name: "Arvada", url: "https://arvadaco.justfoia.com/publicportal/home/newrequest" },
    { name: "Westminster", url: "https://westminsterco.govqa.us/WEBAPP/_rs/(S(ku0kfn0decin3oa5gfkcwhfy))/supporthome.aspx" },
    { name: "Greeley", url: "https://greeleyco.justfoia.com/publicportal/home/newrequest" },
    { name: "Pueblo", url: "https://puebloco.justfoia.com/Forms/Launch/d705cbd6-1396-49b7-939e-8d86c5a87deb" },
    { name: "Centennial", url: "https://us.openforms.com/Form/51069164-e736-4ce5-9607-40412dfd2849" }
  ],
  11: [ // Arkansas (20 cities - will populate sample)
    { name: "Little Rock", url: "https://littlerock.justfoia.com/publicportal/home/track" },
    { name: "Fayetteville", url: "https://fayetteville-ar.justfoia.com/publicportal/home/track" },
    { name: "Fort Smith", url: "https://fortsmithar.govqa.us/WEBAPP/_rs/(S(jwkxmoyqug5snesf14c21mg1))/supporthome.aspx" },
    { name: "Springdale", url: "https://www.springdalear.gov/documents/departments/police/divisions/administrative-division/public-records-requests-%28foia-requests%29/404463" },
    { name: "Jonesboro", url: "https://jonesboroar.justfoia.com/publicportal/home/track" },
    { name: "Rogers", url: "https://www.rogersar.gov/Faq.aspx?QID=293" },
    { name: "Conway", url: "https://conwayarkansas.justfoia.com/publicportal/home/track" },
    { name: "North Little Rock", url: "https://nlr-ar.justfoia.com/publicportal/home/track" },
    { name: "Pine Bluff", url: "https://www.cityofpinebluff-ar.gov/information-request-form" },
    { name: "Hot Springs", url: "https://cityofhotspringsar.nextrequest.com/" }
  ],
  12: [ // Connecticut (34 cities - will populate sample)
    { name: "Bridgeport", url: "https://bridgeportct.mycusthelp.com/WEBAPP/_rs/(S(52hj3ya0cqapdw0hr1fxhwwa))/supporthome.aspx" },
    { name: "New Haven", url: "https://www.newhavenct.gov/government/freedom-of-information-act-records-request" },
    { name: "Hartford", url: "https://hartfordct.govqa.us/WEBAPP/_rs/(S(lgpvtnp3remb5of3gx4d0tlg))/supporthome.aspx" },
    { name: "Waterbury", url: "https://waterburyct.govqa.us/WEBAPP/_rs/(S(hwlib0a4c0z2wvlk3hpk5cbk))/SupportHome.aspx" },
    { name: "Norwalk", url: "https://cityofnorwalkct.nextrequest.com/" },
    { name: "Danbury", url: "https://www.danbury-ct.gov/438/Resources-Forms" },
    { name: "New Britain", url: "https://prodapp.conb.ai/public/foia" },
    { name: "Fairfield", url: "https://townoffairfieldct.nextrequest.com/" },
    { name: "Greenwich", url: "https://www.greenwichct.gov/1138/DPW-FOIA-Records-Request" },
    { name: "Manchester", url: "https://manchesterct.highq.com/manchesterct/renderSmartForm.action?formId=a0664f39-3352-4471-8e9b-840b0d35df2a" }
  ],
  13: [ // Kentucky (45 cities - will populate sample)
    { name: "Louisville", url: "https://louisvillemetrogov-ky.nextrequest.com/" },
    { name: "Lexington", url: "https://lexingtonky.formstack.com/forms/open_records_request_form" },
    { name: "Owensboro", url: "https://owensboroky.rja.revize.com/forms/11141" },
    { name: "Covington", url: "https://www.covingtonky.gov/Portals/covingtonky/220408_Covington%20Open%20Records%20Request%20Form.pdf" },
    { name: "Georgetown", url: "https://www.georgetownky.gov/2251/Open-Records-Request" },
    { name: "Richmond", url: "https://richmondky.gov/government/open_records_request.php" },
    { name: "Florence", url: "https://florence-ky.gov/open-records-request-form/" },
    { name: "Nicholasville", url: "https://cityofnicholasvilleky.nextrequest.com/" },
    { name: "Hopkinsville", url: "https://www.hopkinsvilleky.us/departments/city_clerk/open_records.php" },
    { name: "Independence", url: "https://www.cityofindependence.org/FormCenter/Police-23/Request-for-Public-RecordsReports-BWC-Re-98" }
  ],
  14: [ // Florida (46 cities - will populate sample)
    { name: "Jacksonville", url: "https://jacksonvillefl.govqa.us/WEBAPP/_rs/(S(uxtsxib5wpwbh0v2um34bfsm))/supporthome.aspx" },
    { name: "Miami", url: "https://miami.nextrequest.com/requests/new" },
    { name: "Tampa", url: "https://cityoftampa.govqa.us/WEBAPP/_rs/(S(b3o4sertgpsz5ky52p2y5bc1))/SupportHome.aspx" },
    { name: "Orlando", url: "https://orlando.nextrequest.com/requests/new?dept_id=139" },
    { name: "St. Petersburg", url: "https://stpetefl.mycusthelp.com/WEBAPP/_rs/(S(3g2ntw0t2v2erndhwjioofdg))/supporthome.aspx" },
    { name: "Port St. Lucie", url: "https://portstluciefl.mycusthelp.com/WEBAPP/_rs/(S(y11kdxfuf5yrzssnbark23dp))/supporthome.aspx" },
    { name: "Hialeah", url: "https://cityofhialeahfl.nextrequest.com/" },
    { name: "Cape Coral", url: "https://capecoralfl.mycusthelp.com/WEBAPP/_rs/(S(nhhgwcju0hnxqyh5e4v3metf))/supporthome.aspx" },
    { name: "Tallahassee", url: "https://tallahasseefl.justfoia.com/publicportal/home/newrequest" },
    { name: "Pembroke Pines", url: "https://pembrokepinesfl.mycusthelp.com/webapp/_rs/(S(bh3n325igl4ymhfow23lykv3))/SupportHome.aspx" }
  ],
  15: [ // Texas (97 cities - will populate sample)
    { name: "Houston", url: "https://houstontx.govqa.us/WEBAPP/_rs/(S(a1mlmn4ry01gan54hat3er2u))/SupportHome.aspx" },
    { name: "San Antonio", url: "https://sanantonio.govqa.us/webapp/_rs/(S(2bp3nlwnaby5wzh5wyobbyym))/supporthome.aspx" },
    { name: "Dallas", url: "https://dallastx.govqa.us/WEBAPP/_rs/(S(1isvo1gcgop35m4ifj2wfrbl))/RequestOpen.aspx?rqst=3" },
    { name: "Fort Worth", url: "https://data.fortworthtexas.gov/Property-Data/Code-Violations/spnu-bq4u/about_data" },
    { name: "Austin", url: "https://data.austintexas.gov/Public-Safety/Austin-Code-Complaint-Cases/6wtj-zbtb" },
    { name: "El Paso", url: "https://elpaso.govqa.us/webapp/_rs/(S(hm1uchviveeby3ljoerwkw1b))/supporthome.aspx" },
    { name: "Arlington", url: "https://arlingtontx.govqa.us/WEBAPP/_rs/(S(td4begmvrv5r2gj5rkdqg3sf))/SupportHome.aspx" },
    { name: "Corpus Christi", url: "https://cctexas.jotform.com/form/203084314220036" },
    { name: "Plano", url: "https://planotx.govqa.us/WEBAPP/_rs/(S(af0ehmoyscxatndbphmv2uw5))/SupportHome.aspx" },
    { name: "Lubbock", url: "https://lubbocktx.govqa.us/WEBAPP/_rs/(S(odecowb1fmhmmmxf2gnbtk10))/SupportHome.aspx" }
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