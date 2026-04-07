import fs from 'fs';

const rawData = `Jacksonville	FL	https://jacksonvillefl.govqa.us/WEBAPP/_rs/(S(uxtsxib5wpwbh0v2um34bfsm))/supporthome.aspx	-
Miami	FL	https://miami.nextrequest.com/requests/new	-
Tampa	FL	https://cityoftampa.govqa.us/WEBAPP/_rs/(S(b3o4sertgpsz5ky52p2y5bc1))/SupportHome.aspx	-
Orlando	FL	https://orlando.nextrequest.com/requests/new?dept_id=139	-
St. Petersburg	FL	https://stpetefl.mycusthelp.com/WEBAPP/_rs/(S(3g2ntw0t2v2erndhwjioofdg))/supporthome.aspx	-
Port St. Lucie	FL	https://portstluciefl.mycusthelp.com/WEBAPP/_rs/(S(y11kdxfuf5yrzssnbark23dp))/supporthome.aspx	-
Hialeah	FL	https://cityofhialeahfl.nextrequest.com/	-
Cape Coral	FL	https://capecoralfl.mycusthelp.com/WEBAPP/_rs/(S(nhhgwcju0hnxqyh5e4v3metf))/supporthome.aspx	-
Tallahassee	FL	https://tallahasseefl.justfoia.com/publicportal/home/newrequest	-
Pembroke Pines	FL	https://pembrokepinesfl.mycusthelp.com/webapp/_rs/(S(bh3n325igl4ymhfow23lykv3))/SupportHome.aspx	-
Hollywood	FL	https://hollywoodfl.mycusthelp.com/WEBAPP/_rs/(S(5gekl3ijjjvsmibqxujpbgnb))/supporthome.aspx	-
Gainesville	FL	https://gainesvillefl.justfoia.com/publicportal/home/newrequest	-
Miramar	FL	https://miramarfl.justfoia.com/Forms/Launch/d705cbd6-1396-49b7-939e-8d86c5a87deb	-
Palm Bay	FL	https://www.palmbayfl.gov/government/city-departments-f-to-z/legislative/city-clerk/public-records	-
Coral Springs	FL	https://coralspringsfl.justfoia.com/publicportal/home/newrequest	-
West Palm Beach	FL	https://westpalmbeachfl.govqa.us/WEBAPP/_rs/(S(g33yyqrzcuaiwiexkcy11gnt))/supporthome.aspx	-
Lakeland	FL	https://lakelandfl.mycusthelp.com/webapp/_rs/(S(aahrgak5ljycewvjkjakvoi5))/supporthome.aspx	-
Pompano Beach	FL	https://pompanobeachfl.justfoia.com/Forms/Launch/bce42937-1113-43a5-9c36-a0e42c909425	-
Clearwater	FL	https://clearwaterfl.justfoia.com/publicportal/home/track	-
Miami Gardens	FL	https://miamigardensfl.justfoia.com/publicportal/home/track	-
Davie	FL	https://davie.mycusthelp.com/webapp/_rs/(S(rslltifu5rvmqedn13nu42eb))/supporthome.aspx	-
Palm Coast	FL	https://records.palmcoast.gov/	-
Boca Raton	FL	https://bocaratonfl.justfoia.com/publicportal/home/newrequest	-
Plantation city	FL	https://plantationfl.mycusthelp.com/webapp/_rs/(S(50owiawqiz4tlqbui4kghfge))/supporthome.aspx	-
Deltona	FL	https://deltonafl.mycusthelp.com/WEBAPP/_rs/(S(3tbqckqpdofh2jwfs2tjrtmg))/supporthome.aspx	-
Sunrise	FL	https://www.sunrisefl.gov/departments-services/city-clerk/public-records-lien-searches	-
North Port	FL	https://northportfl.govqa.us/WEBAPP/_rs/(S(1owgdayeasi53nqrnz2osqzd))/SupportHome.aspx?sSessionID=	-
Deerfield Beach	FL	https://deerfieldbeachfl.justfoia.com/Forms/Launch/d705cbd6-1396-49b7-939e-8d86c5a87deb	-
Daytona Beach	FL	https://daytonabeachfl.justfoia.com/publicportal/home/newrequest	-
Homestead	FL	https://homesteadfl.justfoia.com/publicportal/home/track	-
Kissimmee	FL	https://www.kissimmee.gov/My-Government/Public-Records-Data/Make-a-Public-Records-Request	-
Doral	FL	https://us.openforms.com/Form/ef5b0b78-c7b6-4c25-9cb3-0c2a114fa72c	-
Miami Beach	FL	https://northmiamibeachfl.justfoia.com/Forms/Launch/d705cbd6-1396-49b7-939e-8d86c5a87deb	-
Boynton Beach	FL	https://boyntonbeachfl.mycusthelp.com/WEBAPP/_rs/(S(l12fl0dhpuzxv2ges2031t0m))/SupportHome.aspx	-
Largo	FL	https://largofl.justfoia.com/publicportal/home/newrequest	-
The Villages	FL	https://districtgov.justfoia.com/publicportal/home/track	-
Lauderhill	FL	https://lauderhillfl.govqa.us/WEBAPP/_rs/(S(b4ip4wmvmhcbt1fr01nompcu))/supporthome.aspx	-
Tamarac	FL	https://tamaracfl.justfoia.com/Forms/Launch/d705cbd6-1396-49b7-939e-8d86c5a87deb	-
St. Cloud	FL	https://stcloudfl.justfoia.com/publicportal/home/newrequest	-
Weston	FL	https://www.westonfl.org/government/city-clerk/public-records-requests	-
Ocala	FL	https://ocalafl.justfoia.com/publicportal/home/newrequest	-
Delray Beach	FL	https://delraybeach.govqa.us/WEBAPP/_rs/(S(vyjqpavzv3eomcaqiay5it2t))/supporthome.aspx	-
Sanford	FL	https://sanfordfl.mycusthelpadmin.com/WEBAPP/_rs/(S(tovfx5bolbrkj4ecx2u0h0wd))/supporthome.aspx	-
Port Orange	FL	https://portorangefl.justfoia.com/Forms/Launch/d705cbd6-1396-49b7-939e-8d86c5a87deb	-
Palm Beach Gardens	FL	https://palmbeachgardensfl.justfoia.com/Forms/Launch/76e23194-15ff-48a2-9027-e38ef02f3aa3	-
Wellington	FL	https://www.wellingtonfl.gov/FormCenter/Public-Information-Request-Form-4/Public-Information-Request-Form-46	-
Jupiter	FL	https://jupiterfl.justfoia.com/publicportal/home/newrequest
Apopka	FL	https://cityofapopkafl.nextrequest.com/
North Miami	FL	https://northmiamifl.justfoia.com/Forms/Launch/ad7531dc-11a3-4ec9-b579-b6ba88a811bd
Margate	FL	https://margatefl.justfoia.com/publicportal/home/newrequest
Winter Haven	FL	https://www.mywinterhaven.com/248/Public-Records-Requests
Coconut Creek	FL	https://coconutcreekfl.justfoia.com/publicportal/home/newrequest
Bradenton	FL	https://cityofbradenton.govqa.us/WEBAPP/_rs/(S(5qyo3hifowtf4v50t5x2jz21))/supporthome.aspx
Sarasota	FL	https://sarasotafl.justfoia.com/publicportal/home/newrequest
Bonita Springs	FL	https://www.cityofbonitasprings.org/services___departments/city_clerk/public_record_request
Pensacola	FL	https://cityofpensacola.justfoia.com/publicportal/home/newrequest
Pinellas Park	FL	https://pinellasparkpd.govqa.us/WEBAPP/_rs/(S(cnmma3252sb5gm3yc412kzzb))/supporthome.aspx
Ocoee	FL	https://cityofocoeefl.nextrequest.com/
Clermont	FL	https://clermontfl.justfoia.com/publicportal/home/track
Fort Pierce	FL	https://www.cityoffortpierce.com/988/Public-Records-Request
Coral Gables	FL	https://coralgablesfl.justfoia.com/publicportal/home/track
Winter Garden	FL	https://www.cwgdn.com/DocumentCenter/View/64/Public-Records-Request-PDF
Altamonte Springs	FL	https://www.altamonte.org/401/Public-Records-Requests
North Lauderdale	FL	https://northlauderdalefl.justfoia.com/publicportal/home/newrequest
Cutler Bay	FL	https://www.cutlerbay-fl.gov/townclerk/webform/public-records-request
Oakland Park	FL	https://oaklandparkfl.justfoia.com/publicportal/home/track
North Miami Beach	FL	https://northmiamibeachfl.justfoia.com/Forms/Launch/d705cbd6-1396-49b7-939e-8d86c5a87deb
DeLand	FL	https://delandfl.justfoia.com/publicportal/home/track
Greenacres	FL	https://greenacresfl.gov/administration/webform/public-records-request
Ormond Beach	FL	https://ormondbeachfl.justfoia.com/publicportal/home/track
Lake Worth Beach	FL	https://portal.lakeworthbeachfl.gov/public-records-request/
Hallandale Beach	FL	https://hallandalebeachfl.justfoia.com/publicportal/home/newrequest
Royal Palm Beach	FL	https://www.royalpalmbeachfl.gov/clerk/page/public-records-requests
Oviedo	FL	https://cityofoviedo.nextrequest.com/
Aventura	FL	https://aventurafl.justfoia.com/publicportal/home/newrequest
Winter Springs	FL	https://www.winterspringsfl.org/cityclerk/page/public-records-requests
Riviera Beach	FL	https://www.rivierabch.com/clerk/records-request
Estero	FL	https://estero-fl.gov/departments-services/clerk-of-the-village/public-records/
Leesburg	FL	https://www.leesburgflorida.gov/citizen_request_center/index.php
Panama City	FL	https://www.panamacity.gov/580/Public-Records-Request-Contacts
Cooper City	FL	https://cityofcoopercityfl.nextrequest.com/requests/new
Miami Lakes	FL	https://www.miamilakes-fl.gov/town-services/records-request-open-government/
New Smyrna Beach	FL	https://newsmyrnabeachfl.justfoia.com/publicportal/home/newrequest
Dania Beach	FL	https://daniabeachfl.justfoia.com/publicportal/home/newrequest
Rockledge	FL	https://www.cityofrockledge.org/FormCenter/Police-7/Police-Department-Public-Records-Request-55
West Melbourne	FL	https://www.westmelbourne.gov/FormCenter/City-Clerk-9/Public-Records-Request-Form-68
Winter Park	FL	https://cityofwinterparkfl.nextrequest.com/
Crestview	FL	https://city-of-crestview-fl.nextrequest.com/
Venice	FL	https://venicefl.mycusthelp.com/WEBAPP/_rs/(S(rtlmzudi0l14r255obrdzgqb))/supporthome.aspx
Palm Springs	FL	https://vpsfl.justfoia.com/publicportal/home/newrequest
Temple Terrace	FL	https://www.templeterrace.gov/107/Public-Records-Requesting-Information
Sebastian	FL	https://www.cityofsebastian.org/229/Public-Records-Search
Palmetto Bay	FL	https://palmettobayfl.justfoia.com/publicportal/home/track
Eustis	FL	https://www.eustis.org/Services/Public-Records-Requests
Bellview	FL	https://www.belleviewfl.org/formcenter/city-clerk-6/public-records-request-form-53
Groveland	FL	https://groveland-fl.gov/FormCenter/City-of-Groveland-6/Request-for-Public-Records-49
Edgewater	FL	https://edgewaterfl.justfoia.com/publicportal/home/newrequest
Jacksonville Beach	FL	https://jacksonvillebeach.justfoia.com/publicportal/home/newrequest
DeBary	FL	https://debary.org/306/Make-a-Public-Records-Request
Hialeah Gardens	FL	https://www.cityofhialeahgardens.com/city-government/city-clerk-s-office/public-records-request`;

const lines = rawData.trim().split('\n').filter(line => line.trim() !== '');

const cities = lines.map(line => {
    const parts = line.split('\t');
    const name = parts[0].trim();
    const url = parts[2].trim();
    return { name, url };
});

const formattedCities = cities.map(c => `    { name: "${c.name}", url: "${c.url}" }`).join(',\n');

const fileContent = fs.readFileSync('src/pages/Home.jsx', 'utf8');

const countRegex = /\{ id: 14, name: "Florida", cityCount: \d+ \}/;
let newContent = fileContent.replace(countRegex, `{ id: 14, name: "Florida", cityCount: ${cities.length} }`);

const listRegex = /(14: \[ \/\/ Florida - )\d+( cities COMPLETE\n)(.*?)(^\s+\],)/ms;
newContent = newContent.replace(listRegex, `$1${cities.length}$2${formattedCities}\n$4`);

fs.writeFileSync('src/pages/Home.jsx', newContent);
console.log('Update complete. Florida cities updated to', cities.length);
