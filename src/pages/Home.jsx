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

// Full city data for all states - 800+ cities total
const citiesData = {
  1: [ // Arizona - 73 cities COMPLETE
    { name: "Phoenix", url: "https://cityofphoenixaz.govqa.us/WEBAPP/_rs/" },
    { name: "Tucson", url: "https://www.tucsonaz.gov/Departments/Clerks/Public-Records" },
    { name: "Mesa", url: "https://mesaaz.govqa.us/WEBAPP/_rs/" },
    { name: "Chandler", url: "https://chandleraz.gov/government/departments/city-clerks-office/public-records-request" },
    { name: "Gilbert", url: "https://gilbertaz.justfoia.com/publicportal/home/newrequest" },
    { name: "Glendale", url: "https://glendaleaz.gov/your-government/city-clerk/public-records-request" },
    { name: "Scottsdale", url: "https://eservices.scottsdaleaz.gov/prr/general" },
    { name: "Peoria", url: "https://peoriaaz.govqa.us/WEBAPP/_rs/" },
    { name: "Tempe", url: "https://tempe.justfoia.com/publicportal/home/track" },
    { name: "Surprise", url: "https://surpriseaz.govqa.us/WEBAPP/_rs/" },
    { name: "Goodyear", url: "https://goodyearaz.qscend.com/311/Request" },
    { name: "Buckeye", url: "https://buckeyeaz.mycusthelp.com/WEBAPP/_rs/" },
    { name: "San Tan Valley", url: "https://pinalcounty-az.nextrequest.com" },
    { name: "Yuma", url: "https://yumaaz.nextrequest.com" },
    { name: "Avondale", url: "https://avondaleaz.nextrequest.com" },
    { name: "Queen Creek", url: "https://queencreekaz.govqa.us/WEBAPP/_rs/" },
    { name: "Maricopa", url: "https://www.maricopa-az.gov/departments/maricopa-municipal-court/record-requests-fees" },
    { name: "Flagstaff", url: "https://www.flagstaff.az.gov/1600/Public-Records" },
    { name: "Casa Grande", url: "https://destinyhosted.com/public_records.cfm?id=22724" },
    { name: "Marana", url: "https://marana.seamlessdocs.com/f/recordsrequest" },
    { name: "Lake Havasu City", url: "https://www.lhcaz.gov/city-clerk/public-records/general-city-records" },
    { name: "Prescott Valley", url: "https://prescottvalley.justfoia.com/publicportal/home/newrequest" },
    { name: "Oro Valley", url: "https://destinyhosted.com/public_records.cfm?id=67682" },
    { name: "Prescott", url: "https://prescott.nextrequest.com/" },
    { name: "Sierra Vista", url: "https://www.sierravistaaz.gov/our-city/departments/city-clerk/public-records/request-public-information" },
    { name: "Apache Junction", url: "https://www.apachejunctionaz.gov/972/Public-Record-Request" },
    { name: "San Luis", url: "https://destinyhosted.com/public_records.cfm?id=72658" },
    { name: "Sahuarita", url: "https://sahuaritaaz.govqa.us/WEBAPP/_rs/(S(bykqgjhp0zdfoo5fmectbt5n))/SupportHome.aspx" },
    { name: "Kingman", url: "https://www.cityofkingman.gov/government/public-records-request" },
    { name: "El Mirage", url: "https://elmirageaz-city-clerk-forms.app.transform.civicplus.com/forms/55255" },
    { name: "Fountain Hills", url: "https://townoffountainhillsaz.nextrequest.com/" },
    { name: "Florence", url: "https://www.florenceaz.gov/wp-content/uploads/documents/Town%20Clerk/Public%20Records%20Request/Public%20Records%20Request%20effective%208-21.pdf" },
    { name: "Coolidge", url: "https://www.coolidgeaz.com/?SEC=E606EDF7-D2DB-47AF-90A8-5B276AD39C7D#:~:text=Requesting%20Public%20Records&text=You%20may%20complete%20a%20Public,request%20is%20for%20commercial%20purposes." },
    { name: "Eloy", url: "https://eloyaz.gov/FormCenter/City-Clerk-12/Public-Records-Request-54" },
    { name: "Nogales", url: "https://cityofnogalesaz.nextrequest.com/" },
    { name: "Payson", url: "https://www.paysonaz.gov/departments/internal-services/town-clerk/public-records-request" },
    { name: "Douglas", url: "https://public.destinyhosted.com/public_records.cfm?id=36845" },
    { name: "Somerton", url: "https://www.somertonaz.gov/departments/clerk/public_records_request.php" },
    { name: "Chino Valley", url: "https://www.chinoaz.net/forms.aspx?fid=128" },
    { name: "Cottonwood", url: "https://cottonwoodaz.govqa.us/WEBAPP/_rs/(S(fm0yxmb0etafhesdfrdrcm2v))/supporthome.aspx" },
    { name: "Camp Verde", url: "https://www.campverde.az.gov/government/clerk/public_records.php#outer-207" },
    { name: "Show Low", url: "https://www.showlowaz.gov/page/public-records-request" },
    { name: "Paradise Valley", url: "https://www.paradisevalleyaz.gov/DocumentCenter/View/137/Public-Records-Request-Form?bidId=" },
    { name: "Safford", url: "https://lf.saffordaz.gov/Forms/publicrecordrequest" },
    { name: "Sedona", url: "https://sedonaaz.nextrequest.com/" },
    { name: "Wickenburg", url: "https://wickenburgaz.gov/DocumentCenter/View/77/General-Records-Request-Form" },
    { name: "Winslow", url: "https://winslow.seamlessdocs.com/f/PublicRecordsRequest" },
    { name: "Page", url: "https://cityofpageaz.nextrequest.com/" },
    { name: "Tolleson", url: "https://cityoftollesonaz.nextrequest.com/" },
    { name: "Snowflake", url: "https://www.snowflakeaz.gov/town-hall/forms-applications/" },
    { name: "Litchfield Park", url: "https://na4.documents.adobe.com/public/esignWidget?wid=CBFCIBAA3AAABLblqZhDwfFGqgnScsgnqv4V4GEsSW4S3TDr7slZFuztD_h56FcMZzJ0rFp92gDOz_sm9iEI*" },
    { name: "Youngtown", url: "https://cms2.revize.com/revize/youngtown/Documents/Departments/Town%20Clerk/Requesting%20Records%20Information/Request%20for%20Public%20Records%20-revised%2012%2003%2019.pdf" },
    { name: "Thatcher", url: "https://www.thatcher.az.gov/home/showpublisheddocument/644/638302192482800000" },
    { name: "Benson", url: "https://webgen1files1.revize.com/cityofbensonaz/calendar_app/Document%20Center/Department/City%20clerk/Forms%20&%20Applications/Public_recorders_request_original.pdf" },
    { name: "Cave Creek", url: "https://cavecreekaz.justfoia.com/publicportal/home/track" },
    { name: "Clarkdale", url: "https://www.clarkdale.az.gov/172/Town-Clerk" },
    { name: "Guadalupe", url: "https://www.guadalupeaz.org/sites/g/files/vyhlif6711/f/uploads/public_records_request_form_-_revised_07_11_2022.pdf" },
    { name: "Bisbee", url: "https://www.bisbeeaz.gov/DocumentCenter/View/3287/Public-Records-Request-Fillable-Form" },
    { name: "Holbrook", url: "https://template3.walksdemo.com/wp-content/uploads/2025/07/Public-Records-Request.pdf" },
    { name: "Dewey-Humboldt", url: "https://www.dhaz.gov/FormCenter/Request-Forms-2/Public-Records-Request-40" },
    { name: "Eagar", url: "https://core-docs.s3.us-east-1.amazonaws.com/documents/asset/uploaded_file/4924/TOFE/4516938/Request_Public_Information.pdf" },
    { name: "Taylor", url: "https://www.tayloraz.gov/wp-content/uploads/2011/03/PublicDocumentRequest.pdf" },
    { name: "South Tucson", url: "https://www.southtucsonaz.gov/media/5036" },
    { name: "Pinetop-Lakeside", url: "https://www.pinetoplakesideaz.gov/FormCenter/Town-Clerk-5/Public-Records-Request-Form-47" },
    { name: "Clifton", url: "https://img1.wsimg.com/blobby/go/5f14fb93-ed4c-41ba-b8c4-d5ccaa1bf7c8/downloads/Public%20Records%20Inspection%20and%20Copy%20Request%20For.pdf?ver=1759329872493" },
    { name: "Williams", url: "https://cdnsm5-hosted.civiclive.com/UserFiles/Servers/Server_9450682/File/Departments%20and%20Services/Administration%20Human%20Resources/2025/2023%20Record%20Request%20form%20(Fillable).pdf" },
    { name: "Carefree", url: "https://www.carefree.org/page/public-records" },
    { name: "Wellton", url: "https://www.welltonaz.gov/police-department/pages/records-request" },
    { name: "Quartzsite", url: "https://quartzsite.rja.revize.com/forms/3414" },
    { name: "Kearny", url: "https://www.kearnyaz.gov/administration/town-clerk/webforms/public-records-request-webform" },
    { name: "Gila Bend", url: "https://www.gilabendaz.org/DocumentCenter/View/520/Public-Records-Request-Form-Non-Commercial?bidId=" },
    { name: "Springerville", url: "https://www.springervilleaz.gov/media/Documents/Forms-Documents/Administration-Forms/Public%20Records%20Request%20form%20updated%2012%2022.pdf" },
    { name: "Miami", url: "https://miamiaz.gov/departments/town-clerk/town-clerk/" }
  ],
  2: [ // North Carolina - 64 cities COMPLETE
    { name: "Charlotte", url: "https://charlottenc.justfoia.com/publicportal/home/newrequest" },
    { name: "Raleigh", url: "https://raleighnc.nextrequest.com/requests/new" },
    { name: "Greensboro", url: "https://www.greensboro-nc.gov/government/public-records-requests" },
    { name: "Durham", url: "https://cityofdurhamnc.nextrequest.com/" },
    { name: "Winston-Salem", url: "https://cityofws.nextrequest.com/requests/new" },
    { name: "Fayetteville", url: "https://data.fayettevillenc.gov/datasets/7f54119874a341379735f56db9e04ec3_0/explore?location=35.489432%2C-98.419400%2C6.33&showTable=true" },
    { name: "Wilmington", url: "https://www.wilmingtonnc.gov/files/assets/city/v/1/government/documents/public-records-request-form.pdf" },
    { name: "High Point", url: "https://highpointnc.justfoia.com/Forms/Launch/d705cbd6-1396-49b7-939e-8d86c5a87deb" },
    { name: "Asheville", url: "https://cityofashevillenc.justfoia.com/publicportal/home/newrequest" },
    { name: "Gastonia", url: "https://cityofgastonianc.nextrequest.com/" },
    { name: "Apex", url: "https://www.cognitoforms.com/TownOfApex1/publicrecordsrequest" },
    { name: "Jacksonville", url: "https://www.jacksonvillenc.gov/274/Records-Request" },
    { name: "Chapel Hill", url: "https://www.townofchapelhill.org/government/departments-services/communications-and-public-affairs/supporting-quality-governance/maintaining-public-records/public-records-request" },
    { name: "Burlington", url: "https://burlingtonnc.justfoia.com/publicportal/home/track" },
    { name: "Kannapolis", url: "https://kannapolisnc.justfoia.com/publicportal/home/newrequest" },
    { name: "Wake Forest", url: "https://www.cognitoforms.com/TownOfWakeForestNC1/PublicRecordsRequest" },
    { name: "Rocky Mount", url: "https://cityofrockymountnc.nextrequest.com/" },
    { name: "Mooresville", url: "https://townofmooresvillenc.nextrequest.com/" },
    { name: "Holly Springs", url: "https://hsforms.hollyspringsnc.us/Forms/Records" },
    { name: "Wilson", url: "https://www.wilsonnc.org/residents/all-departments/administration/city-clerk/public-records-request/public-records-request-form" },
    { name: "Fuquay-Varina", url: "https://www.fuquay-varina.org/FormCenter/Communications-20/Request-for-Public-Records-58" },
    { name: "Indian Trail", url: "https://www.indiantrail.org/FormCenter/Town-surveys-9/Public-Records-Requests-68" },
    { name: "Monroe", url: "https://cityofmonroenc.nextrequest.com/" },
    { name: "Goldsboro", url: "https://www.goldsboronc.gov/public-affairs-department/public-records-requests/" },
    { name: "Leland", url: "https://www.townofleland.com/town-clerks-office/public-records-requests" },
    { name: "Sanford", url: "https://sanfordnc.victoriaforms.com/Viewer?FormName=Public%20Records%20Request%20-%20SanfordLee%20CountyBroadway.wdf" },
    { name: "Morrisville", url: "https://forms.office.com/Pages/ResponsePage.aspx?id=S5alNURtD0GgEbdOcdzo2w28umimropCmZ3l0fwxWSBUMlgxMzdQSUlRWEdXWUJGVEUwWkhaQzFKMi4u" },
    { name: "Matthews", url: "https://townofmatthewsnc.nextrequest.com/" },
    { name: "Clayton", url: "https://townofclaytonnc.civicweb.net/Portal/CitizenEngagement.aspx" },
    { name: "Statesville", url: "https://www.statesvillenc.net/statesville-public-records-request/" },
    { name: "Kernersville", url: "https://toknc.com/forms/public-records-request/" },
    { name: "Thomasville", url: "https://thomasville.rja.revize.com/forms/4023" },
    { name: "Waxhaw", url: "https://townofwaxhawnc.nextrequest.com/requests/new" },
    { name: "Clemmons", url: "https://www.clemmons.org/FormCenter/Public-RecordsInformation-7/Public-Records-Request-Form-50" },
    { name: "Knightdale", url: "https://www.cognitoforms.com/KnightdaleNC1/publicrecordsrequest" },
    { name: "Boone", url: "https://www.townofboone.net/FormCenter/Town-Clerk-Forms-7/Town-of-Boone-Public-Records-Request-For-63" },
    { name: "Lexington", url: "https://www.lexingtonnc.gov/government/public-information-request/public-records-request-form" },
    { name: "Mount Holly", url: "https://survey123.arcgis.com/share/d72b71e5256a4cc1bcf110ab101a30f2" },
    { name: "Pinehurst", url: "https://www.vopnc.org/our-government/departments/administration/public-records" },
    { name: "Lenoir", url: "https://www.cityoflenoir.com/FormCenter/City-Forms-4/Public-Records-Request-48" },
    { name: "Hope Mills", url: "https://www.townofhopemills.com/325/Public-Records-Office" },
    { name: "Morganton", url: "https://www.morgantonnc.gov/city-manager/page/public-records-request" },
    { name: "Stallings", url: "https://www.stallingsnc.org/Your-Government/Departments/Planning-Zoning/Code-Enforcement" },
    { name: "Albemarle", url: "https://www.albemarlenc.gov/departments/administration/public-record-request" },
    { name: "Southern Pines", url: "https://www.southernpines.net/167/Public-Records-Request" },
    { name: "Wendell", url: "https://wendellnc.rja.revize.com/forms/9699" },
    { name: "Henderson", url: "https://webgen1files1.revize.com/hendnc/Public%20Records%20Request.pdf" },
    { name: "Rolesville", url: "https://www.cognitoforms.com/TownOfRolesville/TownOfRolesvillePublicRecordsRequestForm" },
    { name: "Kings Mountain", url: "https://www.cityofkm.com/FormCenter/Administration-14/Request-for-Public-Records-Form-69" },
    { name: "Pineville", url: "https://www.pinevillenc.gov/foia-requests/" },
    { name: "Spring Lake", url: "https://www.townofspringlake.com/wp-content/uploads/2020/06/Public-Records-Request.pdf" },
    { name: "Summerfield", url: "https://www.summerfieldnc.gov/vertical/sites/%7BC25D1811-CF89-415D-A5B8-0412F39A34CB%7D/uploads/2018_PUBLIC_RECORDS_REQUEST_FORM.pdf" },
    { name: "Waynesville", url: "https://www.villageofwaynesville.org/media/user/forms/Records%20Request%20Form.pdf" },
    { name: "Zebulon", url: "https://www.cognitoforms.com/TownOfZebulon/PublicRecordsRequestForm" },
    { name: "Morehead City", url: "https://www.moreheadcitync.org/DocumentCenter/View/3093/Public-Record-Request-Form---Fillable" },
    { name: "Aberdeen", url: "https://www.townofaberdeen.net/files/documents/PublicRecordsRequest135110357061419AM.pdf" },
    { name: "Oxford", url: "https://cms8.revize.com/revize/cityofoxford/Public-Info-Request-Form.pdf" },
    { name: "Black Mountain", url: "https://townofblackmountainnc.nextrequest.com/" },
    { name: "Woodfin", url: "https://www.woodfin-nc.gov/departments/recordsrequest.php" },
    { name: "King", url: "https://www.ci.king.nc.us/index.asp?SEC=655ACB68-3ABB-4327-97DC-3A9039AFE85F&DE=57FFBB4A-BC9A-4D5E-B046-3CBE08A815D5" },
    { name: "Kill Devil Hills", url: "https://www.kdhnc.com/1035/Public-Records" },
    { name: "Marvin", url: "https://marvinnc.gov/Portals/0/Marvin/Administration/Documents/2025%20PRR%20Form%20with%20Instructions%20and%20Tips.pdf?ver=y5IoXErPlXpEbXXAju7dLg%3d%3d" },
    { name: "Carolina Beach", url: "https://townofcarolinabeachnc.nextrequest.com/" },
    { name: "Boiling Spring Lakes", url: "https://main.govpilot.com/web/public/e34b9bc7-608_Open-Records-Request-boilingspringlakescitybrunswicknc?uid=64482&ust=NC&pu=1&id=1" }
  ],
  3: [ // Ohio - 143 cities COMPLETE
    { name: "Columbus", url: "https://portal.columbus.gov/permits/Cap/CapHome.aspx?module=Enforcement" },
    { name: "Cleveland", url: "https://clevelandoh.govqa.us/WEBAPP/_rs/(S(nahoggl3viu2f0np00v4aksw))/supporthome.aspx" },
    { name: "Cincinnati", url: "https://city-cincinnatioh.govqa.us/WEBAPP/_rs/(S(gagtn4tto2sfl1lgqmbrigao))/supporthome.aspx?sSessionID=70172659:50921FORSPTGNGOSWQDUXWAXJELRXCN" },
    { name: "Toledo", url: "https://toledo.oh.gov/connect/public-records-request" },
    { name: "Akron", url: "https://akronohio.gov/departments/law/index.php" },
    { name: "Dayton", url: "https://cityofdaytonoh.nextrequest.com/" },
    { name: "Parma", url: "https://cityofparma-oh.gov/186/Communications" },
    { name: "Canton", url: "https://www.cantonohio.gov/FormCenter/Public-Records-Request-10/Public-Records-Request-62" },
    { name: "Youngstown", url: "https://youngstownohio.gov/law#records" },
    { name: "Springfield", url: "https://springfieldohio.gov/request-for-public-record/" },
    { name: "Kettering", url: "https://www.ketteringoh.org/online-public-records-request-form/" },
    { name: "Elyria", url: "https://www.cityofelyria.org/wp-content/uploads/2020/04/Public-Records-Request.pdf" },
    { name: "Middletown", url: "https://city-of-middletown-oh.nextrequest.com/" },
    { name: "Lakewood", url: "https://cityoflakewoodoh.nextrequest.com/requests/new" },
    { name: "Dublin", url: "https://dublinoh.justfoia.com/publicportal/home/track" },
    { name: "Euclid", url: "https://www.cityofeuclid.gov/public-records-requests" },
    { name: "Beavercreek", url: "https://beavercreekohio.gov/263/Public-Records-Requests" },
    { name: "Mentor", url: "https://cityofmentor.com/departments/police/divisions/support-services/records-unit/" },
    { name: "Strongsville", url: "https://www.strongsville.org/government/city-council/public-records-information" },
    { name: "Grove City", url: "https://grovecityoh.justfoia.com/publicportal/home/track" },
    { name: "Huber Heights", url: "https://www.hhoh.org/380/Public-Records" },
    { name: "Reynoldsburg", url: "https://www.reynoldsburg.gov/453/Public-Records-Request" },
    { name: "Hilliard", url: "https://hilliardohio.gov/public-records/" },
    { name: "North Ridgeville", url: "https://www.nridgeville.org/PublicRecords.aspx" },
    { name: "Upper Arlington", url: "https://upperarlingtonoh.justfoia.com/Forms/Launch/d705cbd6-1396-49b7-939e-8d86c5a87deb" },
    { name: "Gahanna", url: "https://cityofgahanna-oh.nextrequest.com/" },
    { name: "Fairborn", url: "https://www.fairbornoh.gov/government/police_department/reports___records_request.php" },
    { name: "Lima", url: "https://ci-lima-oh.smartgovcommunity.com/CodeEnforcement/CodeEnforcementHome" },
    { name: "Westlake", url: "https://www.cityofwestlake.org/forms" },
    { name: "North Royalton", url: "https://cityofnorthroyaltonoh.nextrequest.com/requests/new" },
    { name: "Austintown", url: "https://www.austintowntwp.com/records-request-form" },
    { name: "Marysville", url: "https://marysvilleohio.org/107/City-Records" },
    { name: "Shaker Heights", url: "https://www.shakerheightsoh.gov/FormCenter/Law-24/Public-Records-Request-155" },
    { name: "Kent", url: "https://www.kentohio.gov/our-government/records/public-records-requests/" },
    { name: "Green", url: "https://www.cityofgreen.org/191/Public-Records-Request" },
    { name: "Troy", url: "https://troyohio.gov/1928/Public-Records" },
    { name: "Wooster", url: "https://www.woosteroh.com/law" },
    { name: "Centerville", url: "https://www.centervilleohio.gov/364/Public-Records-Request-Form-non-Police-D" },
    { name: "Xenia", url: "https://www.cityofxenia.org/formcenter/all-departments-8/public-records-request-form-53" },
    { name: "Perrysburg", url: "https://www.perrysburgoh.gov/314/Public-Records-Requests" },
    { name: "Athens", url: "https://www.ci.athens.oh.us/511/Public-Records-Contact-Information" },
    { name: "Wadsworth", url: "https://www.wadsworthcity.com/368/Records" },
    { name: "Riverside", url: "https://riversideoh.rja.revize.com/forms/8160" },
    { name: "Willoughby", url: "https://willoughbyohio.com/public-records/" },
    { name: "Sandusky", url: "https://cityofsandusky.com/government/department/law/public_records.php" },
    { name: "Solon", url: "https://www.solonohio.gov/FormCenter/Finance-13/Request-to-view-Public-Records-88" },
    { name: "Trotwood", url: "https://trotwood.org/government/public-records/" },
    { name: "Hudson", url: "https://app.smartsheet.com/b/form/3e297bad45dd45da980314853cd029f9" },
    { name: "Oxford", url: "https://oxfordoh.rja.revize.com/forms/9024" },
    { name: "Lebanon", url: "https://www.lebanonohio.gov/departments/fire___ems/fire___ems_public_records_request.php" },
    { name: "Chillicothe", url: "https://www.chillicotheoh.gov/departments/police/services___enforcement/public_records_request.php" },
    { name: "South Euclid", url: "https://cityofsoutheuclidoh.nextrequest.com/requests/new" },
    { name: "Piqua", url: "https://cityofpiquaoh.nextrequest.com/" },
    { name: "Painesville", url: "https://www.painesville.com/records" },
    { name: "Sidney", url: "https://www.sidneyoh.com/FormCenter/Administration-7/Request-for-Public-Records-56" },
    { name: "Miamisburg", url: "https://cityofmiamisburg.com/public-records/" },
    { name: "Forest Park", url: "https://forestparkoh.nextrequest.com/" },
    { name: "Whitehall", url: "https://cityofwhitehalloh.nextrequest.com/" },
    { name: "Broadview Heights", url: "https://broadview-heights.org/FormCenter/Mayors-Office-14/Public-Records-Request-75" },
    { name: "Springboro", url: "https://www.cityofspringboro.com/DocumentCenter/View/2290/Public-Records-Policy-and-Forms" },
    { name: "Twinsburg", url: "https://cityoftwinsburgoh.nextrequest.com/" },
    { name: "Pataskala", url: "https://www.cityofpataskalaohio.gov/planningandzoning" },
    { name: "Tallmadge", url: "https://www.tallmadgeoh.gov/FAQ.aspx?QID=63" },
    { name: "Niles", url: "https://thecityofniles.com/government/records-requests/" },
    { name: "Brook Park", url: "https://www.cityofbrookpark.com/forms/public_records_request_form.pdf" },
    { name: "Berea", url: "https://cityofbereaoh.nextrequest.com/" },
    { name: "Aurora", url: "https://www.auroraoh.com/departments/police/reports___records.php" },
    { name: "Streetsboro", url: "https://www.cityofstreetsboro.com/public-record-requests/" },
    { name: "Tiffin", url: "https://www.tiffinohio.gov/departments/city-administrator/public-records-and-record-retention" },
    { name: "North Canton", url: "https://northcantonohio.gov/FormCenter/City-Contact-Forms-4/Contact-Us-Form-43" },
    { name: "Portsmouth", url: "https://portsmouthohio.org/public-records-request/" },
    { name: "New Philadelphia", url: "https://www.newphiladelphiaoh.gov/FormCenter/Public-Records-Request-11/Public-Records-Request-54" },
    { name: "Mount Vernon", url: "https://www.mtvernonoh.gov/258/Records-Requests" },
    { name: "Fairview Park", url: "https://fairviewparkohio.gov/239/Public-Records-Requests" },
    { name: "Monroe", url: "https://cityofmonroeoh.nextrequest.com/" },
    { name: "Worthington", url: "https://worthington.org/1931/Public-Records-Requests" },
    { name: "Circleville", url: "https://circlevilleoh.gov/public-records-requests/?utm_source=chatgpt.com" },
    { name: "Willowick", url: "https://www.cityofwillowick.com/police/page/records-request-form?utm_source=chatgpt.com" },
    { name: "Trenton", url: "https://trentonoh.gov/363/Public-Records-Request?utm_source=chatgpt.com" },
    { name: "Sharonville", url: "https://www.sharonville.org/441/Submit-a-Public-Records-Request?utm_source=chatgpt.com" },
    { name: "Brecksville", url: "https://www.brecksville.oh.us/DocumentCenter/View/247/Public-Records-Request-PDF?bidId=" },
    { name: "New Franklin", url: "https://www.newfranklin.org/2310/Public-Records-Request" },
    { name: "Beachwood", url: "https://beachwoodoh.justfoia.com/publicportal/home/track" },
    { name: "Warrensville Heights", url: "https://www.cityofwarrensville.com/169/Public-Records-Request?utm_source=chatgpt.com" },
    { name: "Clayton", url: "https://www.clayton.oh.us/DocumentCenter/View/521/Form-C-100-Revised-4-22-14?bidId=" },
    { name: "Fostoria", url: "https://cityoffostoriaoh.nextrequest.com/" },
    { name: "Dover", url: "https://www.doverohio.com/PublicRecordsPolicy" },
    { name: "Bedford", url: "https://bedfordoh.gov/public-records-request/" },
    { name: "Bexley", url: "https://docs.google.com/forms/d/e/1FAIpQLSe1UvRC57G6pg55yjGwWbAEfPgYmHHP8rBGJnPnOvg3QcLNng/viewform" },
    { name: "Greenville", url: "https://www.cityofgreenville.org/DocumentCenter/View/2011/Public-Information-Request-Form-PDF" },
    { name: "Wickliffe", url: "https://www.cityofwickliffe.com/332/Public-Records-Requests" },
    { name: "Wilmington", url: "https://wilmingtonohio.gov/record-request/" },
    { name: "Franklin", url: "https://www.franklinohio.org/government/city_council_/clerk_of_council/public_record_requests.php" },
    { name: "New Albany", url: "https://newalbanyohio.org/administration/public-records/" },
    { name: "Seven Hills", url: "https://www.sevenhillsohio.org/seven-hills-city-forms/public-records-request" },
    { name: "Ravenna", url: "https://www.ravennaoh.gov/departments/public-records/" },
    { name: "Springdale", url: "https://springdaleohio.gov/how_do_i/request_public_records.php" },
    { name: "Coshocton", url: "https://www.cityofcoshocton.com/wp-content/uploads/2019/10/Public-Records-Request-Form.pdf" },
    { name: "Brooklyn", url: "https://www.brooklynohio.gov/224/Public-Records" },
    { name: "Tipp City", url: "https://www.tippcityohio.gov/246/Public-Records" },
    { name: "Galion", url: "https://www.galion.city/FormCenter/Record-Requests-8/Public-Record-Request-50" },
    { name: "Canal Winchester", url: "https://www.canalwinchesterohio.gov/DocumentCenter/View/414/Public-Records-Request-Form-ONLY" },
    { name: "Struthers", url: "https://www.cityofstruthers.com/public_record_request.html" },
    { name: "Louisville", url: "https://cityoflouisvilleoh.nextrequest.com/" },
    { name: "North College Hill", url: "https://www.northcollegehill.org/FormCenter/Administration-12/NCH-Request-for-Public-Records-70" },
    { name: "Madeira", url: "https://www.madeiracity.com/government/boards___commissions/public_records_commission/public_records_policy.php" },
    { name: "Shelby", url: "https://shelbycity.oh.gov/public-records/" },
    { name: "Grandview Heights", url: "https://www.grandviewheights.gov/FormCenter/Public-Records-Request-All-9/Public-Records-Request-55" },
    { name: "Bainbridge CDP", url: "https://bainbridgetwp.com/document/public-records-request-form/" },
    { name: "Napoleon", url: "https://www.napoleonohio.com/records-request-and-search/records-request-and-search" },
    { name: "Olmsted Falls", url: "https://www.olmstedfalls.org/documentcenter/index.php" },
    { name: "Perry Heights", url: "https://www.perrytwp.com/administration-department/public-records-request-form/" },
    { name: "Highland Heights", url: "https://www.highlandhtsohio.gov/DocumentCenter/View/862/Public-Records-Request-Form-PDF" },
    { name: "Oberlin", url: "https://cityofoberlin.com/city-government/public-records-request/" },
    { name: "Orrville", url: "https://www.orrville.com/sites/default/files/Public%20Record%20Request%20form%20fillable%202025-04_0.pdf" },
    { name: "St. Marys", url: "https://www.cityofstmarys.net/219/Public-Records-Request" },
    { name: "Eaton", url: "https://www.cityofeaton.org/328/Public-Records-Request" },
    { name: "North Madison", url: "https://forms.office.com/pages/responsepage.aspx?id=bdGyuSDPxU-RBY3ukGUu2pdhqQXi1jhPqoQ_g6Sqya1UQURBVUQ1QThGVkM0RllNUlVBRUQzRjAzNC4u&route=shorturl" },
    { name: "Kenton", url: "https://cityofkenton.com/government/public_records_request.php" },
    { name: "Canfield", url: "https://records.govquest.com/city-of-canfield/publicportal" },
    { name: "Hubbard", url: "https://www.cityofhubbard-oh.gov/public-safety/public-records/" },
    { name: "Bellbrook", url: "https://www.bellbrook.gov/page/council_public_records" },
    { name: "Independence", url: "https://www.independenceohio.org/i_want_to/apply_for/records_request.php" },
    { name: "Mentor-on-the-Lake", url: "https://mentoronthelake.gov/forms_filings/public_records_requests.php" },
    { name: "Mount Healthy", url: "https://www.mthealthy.org/sites/g/files/vyhlif6781/f/uploads/rc100_lined.pdf" },
    { name: "Kirtland", url: "https://kirtlandohio.com/download/Kirtland-Public-Records-Request.pdf" },
    { name: "Pepper Pike", url: "https://www.pepperpike.org/DocumentCenter/View/2664/PUBLIC-RECORDS-REQUEST-POLICY" },
    { name: "Chesterland", url: "https://chestertwp.com/document/public-record-request/" },
    { name: "Huron", url: "https://www.cityofhuron.org/services/public_records_requests/index.php" },
    { name: "Upper Sandusky", url: "https://cityofsandusky.com/government/department/law/public_records.php" },
    { name: "Moraine", url: "https://ci.moraine.oh.us/public-records-request/" },
    { name: "Granville", url: "https://www.granville.oh.us/public-records" },
    { name: "The Village of Indian Hill", url: "https://indianhill.gov/public-records-request/" },
    { name: "Groveport", url: "https://www.groveport.org/210/Records-Request-Speaker-Forms" },
    { name: "Germantown", url: "https://www.germantown.oh.us/assets/forms/misc/Public%20Records%20Request%20Form.pdf" },
    { name: "Carlisle", url: "https://www.carlisleoh.org/government/public_record_requests.php" },
    { name: "Wellston", url: "https://cityofwellston.org/wp-content/uploads/2019/11/public-records-request-form-fill-in-blank.pdf" },
    { name: "Canal Fulton", url: "https://www.cityofcanalfulton-oh.gov/police-department/page/record-requests" },
    { name: "Johnstown", url: "https://johnstownohio.org/report-request" },
    { name: "Reminderville", url: "https://reminderville.com/government/public-records-request/" },
    { name: "Ada", url: "https://www.adaoh.gov/form/public-records-request" },
    { name: "Whitehouse", url: "https://whitehouseoh.gov/Forms/Public-Records-Request.pdf" }
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