export default (OCCUPATIONS = [
  { value: 2, label: "Applications Consultant" },
  { value: 18, label: "Butler" },
  { value: 19, label: "Building Demolition Worker" },
  { value: 59, label: "Estate Maintenance Officer" },
  { value: 60, label: "Entertainers" },
  { value: 61, label: "Engineer" },
  { value: 62, label: "Estate Agents" },
  { value: 63, label: "Executive (Office based)" },
  { value: 64, label: "Explosives Worker" },
  { value: 65, label: "Farmer" },
  { value: 66, label: "Fireman / SCDF" },
  { value: 67, label: "Firework Worker" },
  { value: 68, label: "Fisherman" },
  { value: 69, label: "Florist" },
  { value: 70, label: "Financial Controller" },
  { value: 71, label: "Footballer" },
  { value: 72, label: "Foreman" },
  { value: 73, label: "Garage Worker" },
  { value: 74, label: "Gas Distributor" },
  { value: 75, label: "Golf Course Maintenace Worker" },
  { value: 76, label: "Gondola Worker" },
  { value: 77, label: "Hairdresser/Hairstylist" },
  { value: 78, label: "Hospital Attendant" },
  { value: 79, label: "Hostess" },
  { value: 80, label: "Hotel & Restaurant Captains" },
  { value: 81, label: "Housemen" },
  { value: 82, label: "Housekeeper" },
  { value: 83, label: "Housewife" },
  { value: 84, label: "Immigration Officer" },
  { value: 85, label: "Interior Decorators" },
  { value: 86, label: "Jeweller" },
  { value: 87, label: "Jockey/Horse Trainer" },
  { value: 88, label: "Journalist, otherwise" },
  { value: 89, label: "Journalist work in war zone" },
  { value: 90, label: "Judge" },
  { value: 91, label: "Karaoke Worker" },
  { value: 92, label: "Labourer" },
  { value: 93, label: "Laundry & dry cleaning worker" },
  { value: 94, label: "Lawyer" },
  { value: 95, label: "Lecturer" },
  { value: 96, label: "Legal Officer" },
  { value: 97, label: "Lifeguard" },
  { value: 98, label: "Landlord" },
  { value: 99, label: "Machinist" },
  { value: 100, label: "Mahjong Establishment Worker" },
  { value: 101, label: "Masseur/Masseuse" },
  { value: 102, label: "Machine Operator" },
  { value: 103, label: "Model" },
  { value: 104, label: "Mould Maker" },
  { value: 105, label: "Mechanic" },
  { value: 106, label: "Merchant" },
  { value: 107, label: "Merchandiser" },
  { value: 108, label: "Manager (Office)" },
  { value: 109, label: "Mine Worker" },
  { value: 110, label: "Marketing Executive" },
  { value: 111, label: "Musician" },
  { value: 112, label: "Night Club Worker" },
  { value: 113, label: "Nurse" },
  { value: 114, label: "Office Assistant" },
  { value: 115, label: "Officer (Non-uniformed)" },
  { value: 116, label: "Painter" },
  { value: 117, label: "Pastor" },
  { value: 118, label: "Pawnbroker" },
  { value: 119, label: "Packer" },
  { value: 120, label: "Pest Controller/exterminator" },
  { value: 121, label: "Photographer" },
  { value: 122, label: "Physiotherapist" },
  { value: 123, label: "Pilot" },
  { value: 124, label: "Politician" },
  { value: 125, label: "Printer" },
  { value: 126, label: "Policeman" },
  { value: 127, label: "Postman" },
  { value: 128, label: "Professor" },
  { value: 129, label: "Programmer" },
  { value: 130, label: "Purchasing Officer" },
  { value: 131, label: "Quarry Worker" },
  { value: 132, label: "Reporter" },
  { value: 133, label: "Receptionist" },
  { value: 134, label: "Retiree" },
  { value: 135, label: "Retailers" },
  { value: 136, label: "Vicar (Religious)" },
  { value: 137, label: "Radiographer" },
  { value: 138, label: "Sailor, otherwise" },
  { value: 139, label: "Sales Personnel (Indoor)" },
  { value: 140, label: "Scaffolding Worker" },
  { value: 141, label: "Security Guard" },
  { value: 142, label: "Secretary" },
  { value: 143, label: "Security Armed Guard" },
  { value: 144, label: "Shipyard Worker" },
  { value: 145, label: "Shop Keeper" },
  { value: 146, label: "Shop Assistant" },
  { value: 147, label: "Shuttle Driver" },
  { value: 148, label: "Sailor aboard overseas" },
  { value: 149, label: "Singer" },
  { value: 150, label: "Social Worker" },
  { value: 151, label: "Solicitor" },
  { value: 152, label: "Professional Sportsman" },
  { value: 153, label: "Stock Controller" },
  { value: 154, label: "Stevedore" },
  { value: 155, label: "Site Supervisor/Foremen" },
  { value: 156, label: "Student" },
  { value: 157, label: "Stuntman" },
  { value: 158, label: "Surveyor" },
  { value: 159, label: "System Desiger & Analyst" },
  { value: 160, label: "Tailor" },
  { value: 161, label: "Taxi Driver" },
  { value: 162, label: "Tuition Teacher" },
  { value: 163, label: "Teacher" },
  { value: 164, label: "Technician" },
  { value: 165, label: "Telemarketer" },
  { value: 166, label: "Teller" },
  { value: 167, label: "Telex Operator" },
  { value: 168, label: "Tour Guide" },
  { value: 169, label: "Tunnel Worker" },
  { value: 170, label: "Tutor" },
  { value: 171, label: "Typist" },
  { value: 172, label: "Underwriter" },
  { value: 173, label: "Unemployed" },
  { value: 174, label: "Unknown" },
  { value: 175, label: "User Specialist" },
  { value: 176, label: "Video Editor" },
  { value: 177, label: "Vice President" },
  { value: 178, label: "Waiter/Waitress" },
  { value: 179, label: "Welder" },
  { value: 180, label: "Window Cleaner" },
  { value: 181, label: "Writer" },
  { value: 182, label: "Self-employed" },
  { value: 183, label: "Airforce" },
  { value: 184, label: "Civil Defense Officer" },
  { value: 185, label: "Full Time Military Personnel" },
  { value: 186, label: "Navy Officer" },
  { value: 187, label: "Racer" },
  { value: 188, label: "Rig Worker" },
  { value: 189, label: "Ship Crew" }
]);
