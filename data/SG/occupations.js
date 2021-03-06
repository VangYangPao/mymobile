export default (OCCUPATIONS = [
  { label: "Accountant", value: 1 },
  { label: "Applications Consultant", value: 2 },
  { label: "Apprentices", value: 5 },
  { label: "Architect", value: 6 },
  { label: "Auditor", value: 8 },
  { label: "Baker", value: 9 },
  { label: "Banker/Bank Officer", value: 10 },
  { label: "Barber", value: 11 },
  { label: "Bartender", value: 12 },
  { label: "Business Consultant", value: 14 },
  { label: "Beautician", value: 15 },
  { label: "Building Surveyor", value: 16 },
  { label: "Bookkeeper", value: 17 },
  { label: "Butler", value: 18 },
  { label: "Builder", value: 20 },
  { label: "Catering Assistant", value: 21 },
  { label: "Carpenter", value: 22 },
  { label: "Cashier", value: 23 },
  { label: "Casino Workers", value: 24 },
  { label: "Chambermaid", value: 25 },
  { label: "Cargo Surveyor", value: 26 },
  { label: "Clinic Assistant", value: 27 },
  { label: "Cleaners in offices", value: 29 },
  { label: "Clerical Officer", value: 30 },
  { label: "Clerk", value: 31 },
  { label: "Contracts Controller", value: 32 },
  { label: "Computer Operator", value: 33 },
  { label: "Consultant (Medical)", value: 34 },
  { label: "Cook", value: 35 },
  { label: "Co-Ordinator", value: 36 },
  { label: "Computer Programmer", value: 38 },
  { label: "Civil Servants (Office)", value: 42 },
  { label: "Customer Service Officer", value: 43 },
  { label: "Stock Broker", value: 44 },
  { label: "Delivery Worker", value: 45 },
  { label: "Dentist", value: 46 },
  { label: "Dispensing Chemist", value: 47 },
  { label: "Director", value: 48 },
  { label: "Diplomat", value: 51 },
  { label: "Doctor", value: 52 },
  { label: "Domestic Servant", value: 53 },
  { label: "Drainage & Sewage Worker", value: 54 },
  { label: "Dressmaker", value: 55 },
  { label: "Driver", value: 56 },
  { label: "Designer", value: 57 },
  { label: "Electrician", value: 58 },
  { label: "Estate Maintenance Officer", value: 59 },
  { label: "Engineer", value: 61 },
  { label: "Estate Agents", value: 62 },
  { label: "Executive (Office based)", value: 63 },
  { label: "Farmer", value: 65 },
  { label: "Florist", value: 69 },
  { label: "Financial Controller", value: 70 },
  { label: "Foreman", value: 72 },
  { label: "Garage Worker", value: 73 },
  { label: "Golf Course Maintenace Worker", value: 75 },
  { label: "Hairdresser/Hairstylist", value: 77 },
  { label: "Hospital Attendant", value: 78 },
  { label: "Hotel & Restaurant Captains", value: 80 },
  { label: "Housemen", value: 81 },
  { label: "Housekeeper", value: 82 },
  { label: "Housewife", value: 83 },
  { label: "Immigration Officer", value: 84 },
  { label: "Interior Decorators", value: 85 },
  { label: "Jeweller", value: 86 },
  { label: "Jockey/Horse Trainer", value: 87 },
  { label: "Judge", value: 90 },
  { label: "Karaoke Worker", value: 91 },
  { label: "Labourer", value: 92 },
  { label: "Laundry & dry cleaning worker", value: 93 },
  { label: "Lawyer", value: 94 },
  { label: "Lecturer", value: 95 },
  { label: "Legal Officer", value: 96 },
  { label: "Lifeguard", value: 97 },
  { label: "Landlord", value: 98 },
  { label: "Masseur/Masseuse", value: 101 },
  { label: "Mould Maker", value: 104 },
  { label: "Mechanic", value: 105 },
  { label: "Merchant", value: 106 },
  { label: "Merchandiser", value: 107 },
  { label: "Manager (Office)", value: 108 },
  { label: "Marketing Executive", value: 110 },
  { label: "Night Club Worker", value: 112 },
  { label: "Nurse", value: 113 },
  { label: "Office Assistant", value: 114 },
  { label: "Officer (Non-uniformed)", value: 115 },
  { label: "Painter", value: 116 },
  { label: "Pastor", value: 117 },
  { label: "Pawnbroker", value: 118 },
  { label: "Packer", value: 119 },
  { label: "Pest Controller/exterminator", value: 120 },
  { label: "Photographer", value: 121 },
  { label: "Physiotherapist", value: 122 },
  { label: "Politician", value: 124 },
  { label: "Printer", value: 125 },
  { label: "Postman", value: 127 },
  { label: "Professor", value: 128 },
  { label: "Programmer", value: 129 },
  { label: "Purchasing Officer", value: 130 },
  { label: "Receptionist", value: 133 },
  { label: "Retiree", value: 134 },
  { label: "Retailers", value: 135 },
  { label: "Vicar (Religious)", value: 136 },
  { label: "Radiographer", value: 137 },
  { label: "Sales Personnel (Indoor)", value: 139 },
  { label: "Secretary", value: 142 },
  { label: "Security Armed Guard", value: 143 },
  { label: "Shop Keeper", value: 145 },
  { label: "Shop Assistant", value: 146 },
  { label: "Shuttle Driver", value: 147 },
  { label: "Social Worker", value: 150 },
  { label: "Solicitor", value: 151 },
  { label: "Stock Controller", value: 153 },
  { label: "Site Supervisor/Foremen", value: 155 },
  { label: "Student", value: 156 },
  { label: "Surveyor", value: 158 },
  { label: "System Desiger & Analyst", value: 159 },
  { label: "Tailor", value: 160 },
  { label: "Taxi Driver", value: 161 },
  { label: "Tuition Teacher", value: 162 },
  { label: "Teacher", value: 163 },
  { label: "Technician", value: 164 },
  { label: "Telemarketer", value: 165 },
  { label: "Teller", value: 166 },
  { label: "Telex Operator", value: 167 },
  { label: "Tour Guide", value: 168 },
  { label: "Tutor", value: 170 },
  { label: "Typist", value: 171 },
  { label: "Underwriter", value: 172 },
  { label: "Unemployed", value: 173 },
  { label: "User Specialist", value: 175 },
  { label: "Video Editor", value: 176 },
  { label: "Vice President", value: 177 },
  { label: "Waiter/Waitress", value: 178 },
  { label: "Writer", value: 181 },
  { label: "Self-employed", value: 182 }
]);
