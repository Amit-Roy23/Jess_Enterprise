import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  Category,
  Product,
  Service,
  GalleryItem,
  Client,
  SiteSettings,
  AdminUser,
} from "../src/models";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/jess_enterprises";

async function seed() {
  console.log("Connecting to MongoDB for seeding...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully to MongoDB.");

  // 1. Seed Site Settings (Singleton)
  console.log("Seeding Site Settings...");
  await SiteSettings.findOneAndUpdate(
    {},
    {
      companyName: "Jess Enterprises",
      tagline: "Innovative Services",
      phones: {
        mobile: "9158391519",
        office: "9225901519",
      },
      email: "jess.enterprises14@gmail.com",
      address: "Goa, India",
      licenceNumber: "22000126-CLM (Authorised)",
      gstin: "30AZCPG5317P1ZG",
      udyam: "UDYAM-GA-01-0024091 (Micro)",
      socialLinks: {
        whatsapp: "https://wa.me/919158391519",
        linkedin: "",
        facebook: "",
      },
      heroHeadline:
        "Precision Lab Instruments & Authorised Legal Metrology in Goa",
      heroSubheadline:
        "Jess Enterprises is a professional company established to deliver the best services to its clients, looking forward to mutually beneficial business associations with organisations.",
      businessHours: "Monday – Saturday: 9:00 AM – 6:30 PM",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // 2. Seed Admin User
  const adminEmail =
    process.env.INITIAL_ADMIN_EMAIL || "jess.enterprises14@gmail.com";
  const adminName = process.env.INITIAL_ADMIN_NAME || "Admin";
  const adminPass = process.env.INITIAL_ADMIN_PASSWORD || "AdminPassword123!";
  const passwordHash = await bcrypt.hash(adminPass, 10);

  console.log(`Seeding Admin User (${adminEmail})...`);
  await AdminUser.findOneAndUpdate(
    { email: adminEmail.toLowerCase() },
    {
      name: adminName,
      email: adminEmail.toLowerCase(),
      passwordHash,
      role: "admin",
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // 3. Seed Categories
  console.log("Seeding Categories...");
  const categoriesData = [
    {
      name: "Analytical Instruments",
      slug: "analytical-instruments",
      vertical: "lab-instruments",
      description:
        "High-precision analytical spectrophotometers, meters, polarimeters, refractometers, and testing instruments.",
      icon: "FlaskConical",
      order: 1,
      isActive: true,
    },
    {
      name: "Lab Equipment",
      slug: "lab-equipment",
      vertical: "lab-instruments",
      description:
        "Essential laboratory hardware: sonicators, ultrasonic cleaners, ice flakers, furnaces, stirrers, centrifuges, and incubators.",
      icon: "Cpu",
      order: 2,
      isActive: true,
    },
    {
      name: "Weighing",
      slug: "weighing",
      vertical: "legal-metrology",
      description:
        "Precision laboratory analytical balances, moisture analyzers, industrial scales, and crane scales.",
      icon: "Scale",
      order: 3,
      isActive: true,
    },
    {
      name: "Weights & Calibration",
      slug: "weights-calibration",
      vertical: "legal-metrology",
      description:
        "NABL-certified E1, E2, F1, and F2 class standard reference weights for statutory and laboratory calibration.",
      icon: "ShieldCheck",
      order: 4,
      isActive: true,
    },
    {
      name: "Weighing Accessories",
      slug: "weighing-accessories",
      vertical: "legal-metrology",
      description:
        "Anti-vibration pads, balance tables, density meter kits, and balance printers for precision measurements.",
      icon: "Layers",
      order: 5,
      isActive: true,
    },
    {
      name: "Fabrication",
      slug: "fabrication",
      vertical: "fabrication",
      description:
        "Custom engineered fabrication in Acrylic, PVC, Teflon, Polycarbonate, SS (Stainless Steel), and MS (Mild Steel).",
      icon: "Wrench",
      order: 6,
      isActive: true,
    },
  ];

  const categoryMap = new Map<string, mongoose.Types.ObjectId>();
  for (const cat of categoriesData) {
    const doc = await Category.findOneAndUpdate(
      { slug: cat.slug },
      cat,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    categoryMap.set(cat.slug, doc._id as mongoose.Types.ObjectId);
  }

  // 4. Seed Services
  console.log("Seeding Services...");
  const servicesData = [
    {
      title: "Balance AMC & Maintenance Contracts",
      slug: "balance-amc",
      vertical: "legal-metrology",
      summary:
        "Comprehensive Annual Maintenance Contracts (AMC) for laboratory and industrial balances with scheduled preventive checks.",
      description:
        "Jess Enterprises provides dedicated Annual Maintenance Contracts (AMC) tailored for pharmaceutical and industrial quality control laboratories. Our trained service engineers perform routine linearity checks, corner-load testing, repeatability verification, and thorough internal mechanism cleaning.",
      highlights: [
        "Preventive quarterly/bi-annual inspection visits",
        "Emergency breakdown call-outs within guaranteed response time",
        "Full linearity, repeatability, and corner-load verification",
        "Documentation compliant with audit standards (GLP / GMP)",
      ],
      order: 1,
      isActive: true,
    },
    {
      title: "Legal Metrology Stamping & Verification",
      slug: "legal-metrology-stamping",
      vertical: "legal-metrology",
      summary:
        "Government-authorised Legal Metrology verification, stamping, and statutory compliance under Licence No. 22000126-CLM.",
      description:
        "As an officially authorised Legal Metrology service provider (Licence No. 22000126-CLM), Jess Enterprises coordinates and executes statutory verification and re-stamping for all commercial and laboratory weighing instruments across Goa.",
      highlights: [
        "Government Authorised Licence No: 22000126-CLM",
        "End-to-end liaison with Legal Metrology Department inspectors",
        "Pre-verification testing and adjustment to guarantee zero rejection",
        "Official statutory stamping certificates issued promptly",
      ],
      order: 2,
      isActive: true,
    },
    {
      title: "Calibration & Certified Standard Weights",
      slug: "calibration-certified-weights",
      vertical: "legal-metrology",
      summary:
        "NABL-certified E1, E2, F1, and F2 class standard reference weights supply and recalibration certification.",
      description:
        "We supply complete sets and individual precision weights ranging from 1 mg to 20 kg across E1, E2, F1, and F2 accuracy classes, accompanied by authentic NABL calibration certificates for seamless audit compliance.",
      highlights: [
        "E1, E2, F1, and F2 high-grade non-magnetic stainless steel weights",
        "Complete NABL accredited calibration certificates included",
        "Wooden polished protective velvet-lined storage boxes",
        "Periodic recalibration service support",
      ],
      order: 3,
      isActive: true,
    },
    {
      title: "Lab Instrument Sales, Service & AMC",
      slug: "instrument-sales-service",
      vertical: "lab-instruments",
      summary:
        "Supply, installation, calibration, and maintenance of advanced analytical and laboratory equipment.",
      description:
        "We provide sales and lifecycle technical service for spectrophotometers, TOC analyzers, gas generators (N2/H2/air), viscometers, polarimeters, refractometers, ice flakers, and centrifuges.",
      highlights: [
        "Installation and IQ/OQ validation assistance",
        "Genuine spare parts and consumable supplies",
        "On-site breakdown diagnosis and repair",
        "Annual maintenance contracts for analytical instrumentation",
      ],
      order: 4,
      isActive: true,
    },
    {
      title: "Custom Cleanroom Engineering Fabrication",
      slug: "custom-fabrication",
      vertical: "fabrication",
      summary:
        "Custom fabrication of laboratory furniture, balance tables, HPLC cabinets, and enclosures in SS, MS, Acrylic, PVC, Teflon, and Polycarbonate.",
      description:
        "Our specialized fabrication workshop crafts tailored equipment and accessories to exact customer drawings. From 60/72 HPLC column storage cabinets to heavy-duty anti-vibration weighing tables and custom acrylic containment boxes.",
      highlights: [
        "Fabrication in Acrylic, PVC, Teflon, Polycarbonate, SS (304/316), and MS",
        "Precision engineering matched to client CAD/dimensional drawings",
        "Pharma-grade smooth weld finishes and passivated surfaces",
        "Fast turnaround on bespoke prototypes and batch orders",
      ],
      order: 5,
      isActive: true,
    },
  ];

  for (const s of servicesData) {
    await Service.findOneAndUpdate({ slug: s.slug }, s, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }

  // 5. Seed Products (25 table products + profile named instruments)
  console.log("Seeding Products...");
  const productsData = [
    {
      name: "Nano Bio-Spectrophotometer & Spectrophotometer",
      slug: "nano-bio-spectrophotometer-spectrophotometer",
      categorySlug: "analytical-instruments",
      shortDescription:
        "High-performance spectrophotometer for nucleic acid and protein measurement with variable bandwidth.",
      description:
        "Designed for molecular biology and analytical labs, offering precise nucleic acid and protein quantification. Features UV-Vis double/single beam optics with variable spectral bandwidth.",
      specs: [
        { label: "Application", value: "Nucleic acid & protein measurement" },
        { label: "Optical System", value: "UV-Vis double / single beam" },
        { label: "Spectral Bandwidth", value: "Variable: 0.5 / 1.0 / 2 … 10 nm" },
        { label: "Light Source", value: "Xenon flash / Deuterium & Tungsten lamp" },
      ],
      features: [
        "Rapid micro-volume sample analysis without dilution",
        "High photometric accuracy and baseline stability",
        "Intuitive touchscreen interface with export capabilities",
      ],
      applications: ["Genomics & Proteomics", "Pharma QC", "Biochemical Research"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 1,
    },
    {
      name: "Ion / pH / Conductivity / TDS / DO Meter",
      slug: "ion-ph-conductivity-tds-do-meter",
      categorySlug: "analytical-instruments",
      shortDescription:
        "Multi-parameter benchtop meter with 5-point calibration, high resolution, and 500-reading memory.",
      description:
        "Advanced multi-parameter laboratory meter designed for comprehensive electrochemistry testing: pH, mV, Ion concentration, Conductivity, TDS, and Dissolved Oxygen.",
      specs: [
        { label: "Calibration", value: "Up to 5-point automatic calibration" },
        { label: "Resolution", value: "0.001 / 0.01 / 0.1 selectable" },
        { label: "Data Memory", value: "500-reading internal memory with GLP standards" },
        { label: "Display", value: "Large backlit multi-parameter LCD display" },
      ],
      features: [
        "Automatic temperature compensation (ATC)",
        "USB data interface for PC and printer output",
        "Auto-hold and endpoint detection",
      ],
      applications: ["Water Quality Testing", "Pharmaceutical QC", "Chemical Labs"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 2,
    },
    {
      name: "Density Meter Kit",
      slug: "density-meter-kit",
      categorySlug: "weighing-accessories",
      shortDescription:
        "Accessory kit for accurate density determination of solid and liquid samples.",
      description:
        "Precision density determination kit engineered for seamless integration with analytical and precision balances. Enables rapid Archimedean buoyancy density testing.",
      specs: [
        { label: "Function", value: "Density determination of solid & liquid samples" },
        { label: "Compatibility", value: "Standard analytical and precision balances" },
        { label: "Components", value: "Beaker stand, suspension bracket, immersion basket" },
      ],
      features: [
        "High-grade corrosion-resistant stainless steel construction",
        "Direct calculation compatibility with balance firmware",
        "Easy setup and cleaning",
      ],
      applications: ["Materials Science", "Polymer Testing", "Precious Metals"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 3,
    },
    {
      name: "Polarimeter",
      slug: "polarimeter",
      categorySlug: "analytical-instruments",
      shortDescription:
        "Automatic digital polarimeter performing 6 sequential measurements with automatic average calculation.",
      description:
        "High-accuracy digital polarimeter for measuring optical rotation in optically active substances. Features automated multiple measurements for statistical reliability.",
      specs: [
        { label: "Measurement Mode", value: "Automatic measurement 6 times with average calculation" },
        { label: "Light Source", value: "LED (589.44 nm) with optical filter" },
        { label: "Sample Tubes", value: "100 mm and 200 mm tube support" },
      ],
      features: [
        "Peltier temperature control option",
        "Calculation of specific rotation and concentration",
        "GLP compliant data storage and export",
      ],
      applications: ["Sugar & Food Industry", "Pharmaceutical Active Ingredients", "Chemicals"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 4,
    },
    {
      name: "Refractometer – Touch Screen",
      slug: "refractometer-touch-screen",
      categorySlug: "analytical-instruments",
      shortDescription:
        "Digital touchscreen refractometer with 2-second reading time and 1024-result memory.",
      description:
        "Precision benchtop refractometer with high-resolution sapphire prism and color touchscreen. Delivers rapid Brix and refractive index readings in 2 seconds.",
      specs: [
        { label: "Reading Time", value: "2-second rapid reading time" },
        { label: "Memory", value: "Memory storage up to 1024 results" },
        { label: "Interface", value: "Color touchscreen with user access levels" },
        { label: "Prism", value: "Artificial Sapphire Prism with LED illumination" },
      ],
      features: [
        "Built-in Peltier temperature control",
        "Custom scales programming",
        "Audit trail compliant for pharma regulations",
      ],
      applications: ["Pharmaceuticals", "Beverage & Food", "Chemical Manufacturing"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 5,
    },
    {
      name: "Viscometer",
      slug: "viscometer",
      categorySlug: "analytical-instruments",
      shortDescription:
        "Rotational digital viscometer with auto-range function and direct viscosity & temperature display.",
      description:
        "Digital rotational viscometer for measuring absolute viscosity of Newtonian and non-Newtonian fluids. Automatically recommends suitable spindle and speed combinations.",
      specs: [
        { label: "Display", value: "Direct viscosity reading with real-time temperature display" },
        { label: "Range Selection", value: "Auto-range function based on spindle/speed" },
        { label: "Spindles", value: "Standard spindle set (LV / RV series)" },
      ],
      features: [
        "RTD temperature probe included",
        "Continuous viscosity profiling",
        "Direct connection to software for rheological analysis",
      ],
      applications: ["Paints & Coatings", "Cosmetics", "Pharmaceutical Syrups & Gels"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 6,
    },
    {
      name: "Probe Sonicator",
      slug: "probe-sonicator",
      categorySlug: "lab-equipment",
      shortDescription:
        "High-intensity ultrasonic homogenizer / probe sonicator for volume capacities from 1.8 to 25 litres.",
      description:
        "Ultrasonic cell disruptor and homogenizer engineered for processing sample volumes from 1.8 up to 25 litres. Delivers powerful cavitation for cell lysis and emulsification.",
      specs: [
        { label: "Capacity Range", value: "1.8 to 25 litres processing volume" },
        { label: "Ultrasonic Frequency", value: "20 kHz auto-tuning generator" },
        { label: "Titanium Tip", value: "Replaceable titanium alloy probe tips" },
      ],
      features: [
        "Microprocessor controller with digital timer and pulse mode",
        "Sound abating enclosure compatibility",
        "Variable amplitude control (0–100%)",
      ],
      applications: ["Cell Disruption & Lysis", "Nanoparticle Dispersion", "Emulsification"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 7,
    },
    {
      name: "Ultrasonic Cleaner",
      slug: "ultrasonic-cleaner",
      categorySlug: "lab-equipment",
      shortDescription:
        "Laboratory ultrasonic bath cleaner with tank capacities ranging from 6 to 25 litres.",
      description:
        "Heavy-duty stainless steel ultrasonic cleaning bath designed for degasification, dissolution, and thorough particulate cleaning of lab glassware and precision parts.",
      specs: [
        { label: "Tank Capacity", value: "6 to 25 litres available tank sizes" },
        { label: "Tank Material", value: "SUS304 / SUS316 Stainless Steel" },
        { label: "Heating & Timer", value: "Digital heating up to 80 °C with digital timer" },
      ],
      features: [
        "Industrial BLT ultrasonic transducers",
        "Degas function for HPLC solvent preparation",
        "Includes stainless steel basket and lid",
      ],
      applications: ["Glassware Decontamination", "HPLC Solvent Degassing", "Sieve Cleaning"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 8,
    },
    {
      name: "Ice Flaker / Ice Maker",
      slug: "ice-flaker-ice-maker",
      categorySlug: "lab-equipment",
      shortDescription:
        "Fully automatic microprocessor-controlled desktop ice flaker with low-water and Ice Full indicators.",
      description:
        "Compact laboratory ice flake maker designed for biological sample cooling and cold-chain lab experiments. Features automatic harvest cycle and status safety alarms.",
      specs: [
        { label: "Control System", value: "Fully automatic microprocessor controller" },
        { label: "Mounting Type", value: "Desktop / Benchtop compact footprint" },
        { label: "Safety Indicators", value: "Low-water-level and 'Ice Full' safety indicators" },
        { label: "Ice Type", value: "Granular snowflake ice for optimal thermal contact" },
      ],
      features: [
        "Fluorine-free environmentally friendly refrigerant",
        "Stainless steel outer body and food-grade insulated storage bin",
        "Continuous automated ice production",
      ],
      applications: ["Biological Sample Storage", "Protein Extraction", "Chemical Synthesis"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 9,
    },
    {
      name: "Ceramic Magnetic Stirrer",
      slug: "ceramic-magnetic-stirrer",
      categorySlug: "lab-equipment",
      shortDescription:
        "Hotplate magnetic stirrer with chemical-resistant ceramic plate, temp up to 300 °C and speed to 1250 rpm.",
      description:
        "High-performance ceramic hotplate stirrer delivering exceptional chemical resistance, uniform heating up to 300 °C, and strong magnetic coupling up to 1250 rpm.",
      specs: [
        { label: "Max Volume", value: "Up to 2000 ml (H2O)" },
        { label: "Max Temperature", value: "Up to 300 °C" },
        { label: "Speed Range", value: "Up to 1250 rpm" },
        { label: "Plate Material", value: "Acid and alkali resistant white ceramic" },
      ],
      features: [
        "Over-temperature safety cutoff",
        "Residual hot-surface warning indicator",
        "Smooth stepless speed and temperature adjustment",
      ],
      applications: ["Solution Preparation", "Titration", "General Lab Heating"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 10,
    },
    {
      name: "Balances (Lab & Industrial)",
      slug: "balances-lab-industrial",
      categorySlug: "weighing",
      shortDescription:
        "Precision analytical, micro-balances, precision top-loading, and heavy industrial weighing platforms.",
      description:
        "Complete range of precision balances and industrial weighing scales with government Legal Metrology stamping approval. Built with electromagnetic force restoration sensors for pinpoint accuracy.",
      specs: [
        { label: "Type Range", value: "Laboratory analytical & Industrial platform balances" },
        { label: "Readability", value: "0.1 mg / 1 mg / 10 mg / 0.1 g / 1 g options" },
        { label: "Compliance", value: "Legal Metrology Stamping & Verification compliant" },
      ],
      features: [
        "Internal motorized calibration or external calibration options",
        "Draft shield chamber with glass sliding doors for analytical models",
        "RS232/USB interfaces for printer and LIMS connection",
      ],
      applications: ["Pharma Formulation", "Analytical QC", "Industrial Batching"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 11,
    },
    {
      name: "Crane Scale",
      slug: "crane-scale",
      categorySlug: "weighing",
      shortDescription:
        "Heavy-duty suspended crane scale with 5 to 10 ton capacity, wireless remote indicator and rechargeable battery.",
      description:
        "Rugged industrial crane scale for overhead material weighing in factories, warehouses, and steel yards. Features wireless remote display handheld terminal.",
      specs: [
        { label: "Capacity", value: "5 to 10 ton high-load capacity" },
        { label: "Indicator", value: "Wireless handheld indicator with large digits" },
        { label: "Power", value: "Heavy-duty rechargeable battery with long runtime" },
        { label: "Hook", value: "360-degree rotating forged safety hook" },
      ],
      features: [
        "Die-cast aluminium housing with overload protection",
        "Tare, hold, and unit conversion functions",
        "Wireless transmission range up to 100 meters",
      ],
      applications: ["Steel Works", "Foundries", "Freight & Heavy Logistics"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 12,
    },
    {
      name: "Moisture Analyzer",
      slug: "moisture-analyzer",
      categorySlug: "weighing",
      shortDescription:
        "Halogen heating moisture analyzer with 0.01 mg / 1 mg display for rapid moisture determination.",
      description:
        "High-precision moisture analyzer utilizing circular halogen lamp heating for uniform sample drying and accurate loss-on-drying (LOD) moisture content analysis.",
      specs: [
        { label: "Display Resolution", value: "0.01 mg / 1 mg display resolution" },
        { label: "Heating Technology", value: "Halogen radiation heating" },
        { label: "Temperature Range", value: "40 °C to 200 °C" },
        { label: "Pan Size", value: "Standard 90 mm aluminum sample pans" },
      ],
      features: [
        "Standard, gentle, stage, and quick drying profiles",
        "Real-time drying curve graph visualization",
        "Compliant GLP/GMP test printouts",
      ],
      applications: ["Pharma Powders & Granules", "Food Moisture", "Chemical Moisture Content"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 13,
    },
    {
      name: "E1, E2, F1 & F2 Class Standard Weights",
      slug: "e1-e2-f1-f2-class-weights",
      categorySlug: "weights-calibration",
      shortDescription:
        "All standard analytical and precision reference weights with authentic NABL calibration certificates.",
      description:
        "High-purity non-magnetic stainless steel reference weights manufactured in accordance with OIML R111 recommendations. Supplied in single pieces or complete boxed sets.",
      specs: [
        { label: "Accuracy Classes", value: "E1, E2, F1, and F2 standard classes" },
        { label: "Certification", value: "NABL Accredited Calibration Certificate" },
        { label: "Range", value: "1 mg to 20 kg sets and individual weights" },
        { label: "Material", value: "Highly polished non-magnetic austenitic stainless steel" },
      ],
      features: [
        "Corrosion-resistant mirror polished finish",
        "Luxury velvet-lined wooden storage case with handling forceps",
        "Legal Metrology audit ready",
      ],
      applications: ["Balance Calibration", "Pharma Audits", "Metrology Labs"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 14,
    },
    {
      name: "Digital Water Bath",
      slug: "digital-water-bath",
      categorySlug: "lab-equipment",
      shortDescription:
        "Microprocessor-controlled digital water bath for uniform sample incubation and temperature maintenance.",
      description:
        "Precision laboratory water bath with seamless stainless steel inner tank and digital PID temperature controller for reliable constant temperature baths.",
      specs: [
        { label: "Type", value: "Digital water bath" },
        { label: "Temperature Range", value: "Ambient +5 °C to 99.9 °C" },
        { label: "Tank Material", value: "Seamless SUS304 stainless steel" },
      ],
      features: [
        "Digital LED display with set and actual temperature readings",
        "Concentric ring cover sets included",
        "Low water level protection sensor",
      ],
      applications: ["Reagent Warming", "Sample Incubation", "Bacteriological Testing"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 15,
    },
    {
      name: "Melting Point Apparatus",
      slug: "melting-point-apparatus",
      categorySlug: "analytical-instruments",
      shortDescription:
        "Digital melting point apparatus for quick reading with capacity to melt 3 samples simultaneously.",
      description:
        "Semi-automatic melting point tester with high-resolution viewing lens and digital PID heating. Capable of evaluating 3 capillary samples simultaneously.",
      specs: [
        { label: "Sample Capacity", value: "3 samples melted simultaneously" },
        { label: "Reading Speed", value: "Quick reading with digital plateau display" },
        { label: "Temperature Range", value: "Ambient to 300 °C / 350 °C" },
      ],
      features: [
        "Integrated magnifying observation window with shadowless LED",
        "Linear heating rate control (0.1 °C/min to 10 °C/min)",
        "Memory storage of melting curves",
      ],
      applications: ["Compound Purity Check", "Active Pharma Identification", "Organic Chemistry"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 16,
    },
    {
      name: "Muffle Furnace",
      slug: "muffle-furnace",
      categorySlug: "lab-equipment",
      shortDescription:
        "High-temperature laboratory muffle furnace reaching maximum temperatures of 1000 °C to 1300 °C.",
      description:
        "Ceramic fiber insulated box muffle furnace engineered for ashing, heat treating, sintering, and material ignition tests in high-temperature environments.",
      specs: [
        { label: "Max Temperature", value: "1000 °C to 1300 °C max temperature rating" },
        { label: "Insulation", value: "High-grade vacuum formed ceramic fiber" },
        { label: "Controller", value: "Multi-segment programmable digital PID controller" },
      ],
      features: [
        "Fast heating with low outer shell temperature",
        "Safety door cutoff switch",
        "Thermocouple over-temperature protection",
      ],
      applications: ["Ashing & Loss on Ignition", "Heat Treatment", "Ceramic Sintering"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 17,
    },
    {
      name: "Magnetic Stirrers (various types)",
      slug: "magnetic-stirrers-various-types",
      categorySlug: "lab-equipment",
      shortDescription:
        "Multiple position, unheated, and analog magnetic stirrers for diverse laboratory mixing demands.",
      description:
        "Assorted magnetic stirrers including multi-station models, compact battery-operated stirrers, and heavy-viscosity stirrers. Specifications pending client review.",
      specs: [],
      features: [
        "Quiet and smooth motor operation",
        "Compact footprint",
        "Chemical-resistant top plates",
      ],
      applications: ["General Mixing", "Buffer Preparation"],
      isFeatured: false,
      isActive: true,
      needsReview: true, // Prompt requirement: specs not given - mark needsReview: true
      order: 18,
    },
    {
      name: "Shakers (Orbital, Rocking, 3D, Tube Roller, Rotator)",
      slug: "shakers",
      categorySlug: "lab-equipment",
      shortDescription:
        "Comprehensive shaker range: Orbital, rocking, 3D gyratory, tube rollers, and rotary mixers.",
      description:
        "Laboratory shakers and mixers for culture aeration, staining/destaining gels, blood sample mixing, and chemical hybridization protocols.",
      specs: [
        { label: "Motion Types", value: "Orbital, rocking, 3D, tube roller, rotator" },
        { label: "Speed Control", value: "Digital stepless speed regulation" },
        { label: "Platform", value: "Interchangeable universal platforms and clamps" },
      ],
      features: [
        "Continuous or timed operation modes",
        "Brushless DC motor for maintenance-free long life",
        "Smooth agitation without sample spillage",
      ],
      applications: ["Microbiology", "Cell Culture", "Blood Hematology", "Western Blotting"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 19,
    },
    {
      name: "BOD Incubator",
      slug: "bod-incubator",
      categorySlug: "lab-equipment",
      shortDescription:
        "Cooled biochemical oxygen demand (BOD) incubator with accurate temperature range of 0 °C to 65 °C.",
      description:
        "Forced-air refrigerated incubator specifically designed for BOD determinations, plant and cell culture incubation, fermentation studies, and seed germination.",
      specs: [
        { label: "Temperature Range", value: "0 to 65 °C with high uniformity" },
        { label: "Inner Chamber", value: "Mirror finished SUS304 stainless steel" },
        { label: "Controller", value: "Microprocessor PID digital temperature controller" },
      ],
      features: [
        "Hermetically sealed eco-friendly cooling compressor",
        "Internal glass door for sample observation without temperature loss",
        "Internal power socket for stirring equipment",
      ],
      applications: ["Wastewater BOD Analysis", "Pharma Stability Testing", "Microbiology Incubation"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 20,
    },
    {
      name: "SS Fabrication (Stainless Steel Works)",
      slug: "ss-fabrication",
      categorySlug: "fabrication",
      shortDescription:
        "Custom pharmaceutical-grade SS 304 / SS 316 fabrication manufactured per customer specifications.",
      description:
        "Custom stainless steel workshop engineering including pharma cleanroom furniture, drum trolleys, sampling booths, pass boxes, vessels on stands, and bespoke trays.",
      specs: [
        { label: "Specifications", value: "As per customer requirement and engineering drawing" },
        { label: "Grade", value: "SS 304 / SS 316 / SS 316L mirror or matte finish" },
        { label: "Welding", value: "Argon TIG welding with smooth crevice-free passivation" },
      ],
      features: [
        "Zero-crevice hygienic design for pharma audit compliance",
        "Custom dimensions and load-bearing designs",
        "Factory inspection and dimensional signoff",
      ],
      applications: ["Pharma Cleanrooms", "Food & Beverage Processing", "Chemical Units"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 21,
    },
    {
      name: "MS Fabrication (Mild Steel Works)",
      slug: "ms-fabrication",
      categorySlug: "fabrication",
      shortDescription:
        "Heavy-duty mild steel structural frames, stands, machine guards, and custom industrial brackets.",
      description:
        "Industrial mild steel fabrication tailored to industrial factory and warehouse needs. Finished with anti-corrosion primer and industrial epoxy powder coating.",
      specs: [
        { label: "Specifications", value: "As per customer requirement" },
        { label: "Finishing", value: "Epoxy powder coating / anti-rust primer / PU paint" },
        { label: "Structure", value: "Heavy-duty structural tubular and sheet steel" },
      ],
      features: [
        "High mechanical strength and load capacities",
        "Custom mounting points and leveler feet",
        "Precision cutting and CNC bending",
      ],
      applications: ["Industrial Plants", "Machinery Enclosures", "Heavy Workbenches"],
      isFeatured: false,
      isActive: true,
      needsReview: false,
      order: 22,
    },
    {
      name: "Acrylic Fabrication",
      slug: "acrylic-fabrication",
      categorySlug: "fabrication",
      shortDescription:
        "Custom transparent acrylic cabinets, trays, desiccators, balance hoods, and safety enclosures.",
      description:
        "Bespoke transparent and colored acrylic (PMMA) fabrication. Precision laser cut, CNC routed, and chemically bonded for crystal-clear optical clarity.",
      specs: [
        { label: "Scope", value: "Any type of cabinet, tray, hood, or enclosure" },
        { label: "Material", value: "High-grade optical cast acrylic sheet (2 mm to 25 mm)" },
        { label: "Joints", value: "Solvent welded bubble-free seams" },
      ],
      features: [
        "Crystal-clear transparency and lightweight structural strength",
        "Hinged doors, magnetic latches, and glove ports available",
        "Custom labeling and laser engraving",
      ],
      applications: ["Balance Enclosures", "Cleanroom Storage", "Sample Display & Trays"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 23,
    },
    {
      name: "HPLC Column Storage Cabinet",
      slug: "hplc-column-storage-cabinet",
      categorySlug: "fabrication",
      shortDescription:
        "Specialized HPLC column organization and storage cabinets accommodating 60 and 72 columns per unit.",
      description:
        "Dedicated HPLC and GC column organizing storage cabinets engineered with protective grooved drawers. Prevents column roll, impact damage, and label wear.",
      specs: [
        { label: "Capacity", value: "60 and 72 columns per cabinet options" },
        { label: "Material", value: "Acrylic / SS / Polycarbonate construction" },
        { label: "Drawers", value: "Molded cushioned column cradles with ID index card slots" },
      ],
      features: [
        "Numbered slots for easy column tracking and audit log alignment",
        "Lockable acrylic transparent doors",
        "Compact footprint fitting on standard lab benchtops",
      ],
      applications: ["HPLC Analytical Labs", "Chromatography QC", "Pharma R&D"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 24,
    },
    {
      name: "Centrifuge",
      slug: "centrifuge",
      categorySlug: "lab-equipment",
      shortDescription:
        "Low noise, lightweight laboratory centrifuge with speed options of 4000 / 12000 / 16000 rpm.",
      description:
        "High-performance benchtop centrifuge with aerodynamic rotor design. Delivers whisper-quiet operation and rapid acceleration/deceleration for microtubes and clinical tubes.",
      specs: [
        { label: "Speed Options", value: "4000 / 12000 / 16000 rpm selectable models" },
        { label: "Features", value: "Low noise, lightweight aerodynamic body" },
        { label: "Rotor Types", value: "Angle rotors for 1.5/2.0 ml, PCR strips, and clinical tubes" },
      ],
      features: [
        "Electronic safety lid lock system",
        "Digital LED display of speed (RPM) and RCF (g-force)",
        "Short-spin quick run button",
      ],
      applications: ["Clinical Biochemistry", "Molecular Biology", "Cell Pellet Separation"],
      isFeatured: true,
      isActive: true,
      needsReview: false,
      order: 25,
    },

    // Additional profile instruments marked needsReview: true with empty specs
    {
      name: "TOC Analyzer (Total Organic Carbon)",
      slug: "toc-analyzer",
      categorySlug: "analytical-instruments",
      shortDescription:
        "Total Organic Carbon analyzer for purified water and water-for-injection (WFI) testing.",
      description:
        "Precision laboratory TOC analyzer for pharma water testing and cleaning validation. Detailed specifications pending client review.",
      specs: [],
      features: ["Complies with USP <643> and EP 2.2.44", "Online and offline testing capability"],
      applications: ["Pharma WFI Water", "Cleanroom Cleaning Validation"],
      isFeatured: false,
      isActive: true,
      needsReview: true,
      order: 26,
    },
    {
      name: "Nitrogen (N2) Gas Generator",
      slug: "nitrogen-gas-generator",
      categorySlug: "lab-equipment",
      shortDescription:
        "Ultra-pure laboratory nitrogen generator for LC-MS, GC, and sample evaporators.",
      description:
        "High-purity N2 generator eliminating high-pressure gas cylinders in analytical laboratories. Specifications pending client review.",
      specs: [],
      features: ["Continuous on-demand nitrogen generation", "Quiet built-in oil-free compressor"],
      applications: ["LC-MS / Sample Evaporation", "Inert Gas Blanketing"],
      isFeatured: false,
      isActive: true,
      needsReview: true,
      order: 27,
    },
    {
      name: "Hydrogen (H2) Gas Generator",
      slug: "hydrogen-gas-generator",
      categorySlug: "lab-equipment",
      shortDescription:
        "High-purity hydrogen gas generator for GC-FID detector carrier and fuel gas supply.",
      description:
        "PEM membrane electrolysis hydrogen generator for gas chromatography. Specifications pending client review.",
      specs: [],
      features: ["Auto-shutoff leak detection safety features", "Deionized water operation"],
      applications: ["Gas Chromatography FID", "Hydrogenation"],
      isFeatured: false,
      isActive: true,
      needsReview: true,
      order: 28,
    },
    {
      name: "Zero Air Gas Generator",
      slug: "zero-air-gas-generator",
      categorySlug: "lab-equipment",
      shortDescription:
        "Hydrocarbon-free zero air generator for GC flame ionization detectors (FID, FPD, NPD).",
      description:
        "Catalytic zero air generator delivering ultra-pure air (<0.05 ppm total hydrocarbons). Specifications pending client review.",
      specs: [],
      features: ["Platinum catalyst technology", "Stable baseline performance"],
      applications: ["GC Flame Detectors", "Total Hydrocarbon Analyzers"],
      isFeatured: false,
      isActive: true,
      needsReview: true,
      order: 29,
    },
    {
      name: "Circulating Bath",
      slug: "circulating-bath",
      categorySlug: "lab-equipment",
      shortDescription:
        "Refrigerated and heated constant temperature circulating bath for jacketed vessels and viscometers.",
      description:
        "Laboratory thermostatic circulation bath. Specifications pending client review.",
      specs: [],
      features: ["Internal and external circulation capability", "Digital temperature stability"],
      applications: ["Viscometer Jacket Heating", "Refractometer Temp Control", "Reactor Cooling"],
      isFeatured: false,
      isActive: true,
      needsReview: true,
      order: 30,
    },
    {
      name: "Turbidity Meter",
      slug: "turbidity-meter",
      categorySlug: "analytical-instruments",
      shortDescription:
        "Nephelometric benchtop and portable turbidity meter for liquid clarity evaluation.",
      description:
        "Precision turbidity analyzer measuring NTU/FNU clarity standards. Specifications pending client review.",
      specs: [],
      features: ["Nephelometric 90° light scatter detection", "Standard Formazin calibration curves"],
      applications: ["Water Treatment", "Beverage Quality", "Pharma Injections"],
      isFeatured: false,
      isActive: true,
      needsReview: true,
      order: 31,
    },
    {
      name: "Anti-Vibration Pad & Balance Table",
      slug: "anti-vibration-pad-balance-table",
      categorySlug: "weighing-accessories",
      shortDescription:
        "Heavy marble slab anti-vibration weighing tables and isolation pads for micro and analytical balances.",
      description:
        "Vibration isolation balance tables and elastomer pads eliminating ambient floor oscillations and drafts. Specifications pending client review.",
      specs: [],
      features: ["Polished natural granite/marble top slab", "Heavy tubular steel dampening frame"],
      applications: ["Analytical Balances", "Microbalances", "Atomic Force Microscopy"],
      isFeatured: false,
      isActive: true,
      needsReview: true,
      order: 32,
    },
    {
      name: "Balance Printer",
      slug: "balance-printer",
      categorySlug: "weighing-accessories",
      shortDescription:
        "Direct thermal and dot-matrix balance data printer for GLP/GMP compliant weighing slips.",
      description:
        "Dedicated statistical printer connecting to laboratory balances via RS232 interface. Specifications pending client review.",
      specs: [],
      features: ["Prints date, time, sample ID, tare, gross, and net weight", "GLP/GMP audit headers"],
      applications: ["Weighing Records", "Pharma Batch Records"],
      isFeatured: false,
      isActive: true,
      needsReview: true,
      order: 33,
    },
  ];

  for (const p of productsData) {
    const categoryId = categoryMap.get(p.categorySlug);
    if (!categoryId) continue;

    await Product.findOneAndUpdate(
      { slug: p.slug },
      {
        name: p.name,
        slug: p.slug,
        category: categoryId,
        shortDescription: p.shortDescription,
        description: p.description,
        specs: p.specs,
        features: p.features,
        applications: p.applications,
        isFeatured: p.isFeatured,
        isActive: p.isActive,
        needsReview: p.needsReview,
        order: p.order,
        tags: [p.name, p.categorySlug],
        seo: {
          title: `${p.name} | Jess Enterprises Goa`,
          description: p.shortDescription,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // 6. Seed Clients (all 18 clients as text names only)
  console.log("Seeding Clients...");
  const clientsList = [
    "Colorcon",
    "Glenmark Pharmaceuticals",
    "Geno Pharmaceuticals",
    "Centaur",
    "Venus Ethoxyethers",
    "Unichem Laboratories",
    "Syngenta",
    "Zydus Cadila",
    "Kineco Kaman",
    "Micro Labs",
    "Sanofi",
    "Indoco Remedies",
    "Fertin Pharma",
    "Cipla",
    "National Institute of Oceanography (Goa)",
    "Esteem Group",
    "Deccan Fine Chemicals",
    "BITS Pilani K K Birla Goa Campus",
  ];

  let clientOrder = 1;
  for (const clientName of clientsList) {
    await Client.findOneAndUpdate(
      { name: clientName },
      {
        name: clientName,
        logo: "", // Text names only until admin uploads logos
        website: "",
        order: clientOrder++,
        isActive: true,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  // 7. Seed Sample Gallery Items for Custom Fabrication
  console.log("Seeding Gallery Items...");
  const galleryData = [
    {
      title: "Cleanroom SS 316 Storage Vessel with Mobile Stand",
      material: "SS",
      description:
        "Mirror-polished SS 316 storage vessel mounted on an ergonomic mobile caster frame for pharmaceutical cleanroom batch operations.",
      order: 1,
      isActive: true,
    },
    {
      title: "Stainless Steel Heavy-Duty Drum Trolley",
      material: "SS",
      description:
        "Ergonomic SS 304 chemical drum handling trolley with safety locking clamp for 200-litre industrial drums.",
      order: 2,
      isActive: true,
    },
    {
      title: "Heavy-Duty MS Machine Structural Frame",
      material: "MS",
      description:
        "Precision welded Mild Steel machine frame finished with high-durability industrial epoxy powder coating.",
      order: 3,
      isActive: true,
    },
    {
      title: "Custom 72-Column HPLC Acrylic Storage Cabinet",
      material: "Acrylic",
      description:
        "Clear cast acrylic HPLC column organizer cabinet with precision-slotted pull-out trays and clear lockable door.",
      order: 4,
      isActive: true,
    },
    {
      title: "Custom Acrylic Balance Isolation Enclosure Hood",
      material: "Acrylic",
      description:
        "Optical grade transparent acrylic draft shield enclosure engineered for microbalance weighing protection.",
      order: 5,
      isActive: true,
    },
    {
      title: "Industrial PVC Chemical Acid Bath Tank",
      material: "PVC",
      description:
        "Heavy-duty rigid PVC welded chemical dip tank designed for aggressive acid cleaning and parts degreasing.",
      order: 6,
      isActive: true,
    },
    {
      title: "Custom CNC Machined Teflon (PTFE) Lab Components",
      material: "Teflon",
      description:
        "High-purity virgin Teflon custom machined stoppers, seals, and acid-resistant sampling spoons.",
      order: 7,
      isActive: true,
    },
    {
      title: "Impact-Resistant Polycarbonate Safety Shield",
      material: "Polycarbonate",
      description:
        "High-impact shatterproof polycarbonate protective blast shield for high-pressure chemical reaction flasks.",
      order: 8,
      isActive: true,
    },
  ];

  for (const item of galleryData) {
    await GalleryItem.findOneAndUpdate({ title: item.title }, item, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }

  console.log("Seeding completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
