export const mockContracts = {
  rent_agreement: {
    name: "Residential Lease Agreement.pdf",
    type: "Rent Agreement",
    healthScore: 68,
    stats: { risky: 3, caution: 2, safe: 4 },
    summary: "A standard residential lease for a 12-month term. Key issues involve auto-renewal penalties and landlord entry rights. Utilities and maintenance responsibilities are standard.",
    clauses: [
      {
        id: "r1",
        title: "Rent Escalation & Auto-Renewal",
        status: "risky",
        original: "Upon expiration of the initial lease term, this agreement shall automatically renew for successive one-year terms unless either party provides written notice of non-renewal at least 90 days prior. Upon renewal, the monthly rent shall automatically increase by 15% of the preceding month's rent without prior notice.",
        simplified: "The lease renews automatically every year for another year unless you cancel 90 days in advance. Plus, your rent will jump by 15% each time it renews, without the landlord notifying you.",
        explanation: "15% is a very high rent hike, and 90 days is a long notice period. Typically, rent increases are negotiated or tied to inflation, and notice periods are 30 or 60 days.",
        renegotiate: "Ask to change this to a month-to-month renewal with at least 60 days notice, and limit rent increases to a maximum of 5% or the local inflation index."
      },
      {
        id: "r2",
        title: "Landlord Right of Entry",
        status: "caution",
        original: "The Landlord and their agents reserve the right to enter the leased premises at any time, with or without prior notice, for the purposes of inspection, repairs, maintenance, alterations, or showing the premises to prospective tenants, buyers, or mortgagees.",
        simplified: "The landlord can walk into your apartment whenever they want, for any reason, and doesn't have to give you any advance warning.",
        explanation: "This violates your right to quiet enjoyment of the property. Standard agreements require at least 24 hours of advance notice except in emergencies.",
        renegotiate: "Change the clause to require a minimum of 24 hours written notice for entry, and specify that entry must occur during normal business hours (e.g., 9 AM - 6 PM)."
      },
      {
        id: "r3",
        title: "Security Deposit Forfeiture",
        status: "risky",
        original: "Should Tenant fail to occupy the premises for the entire duration of the agreed lease term, or should the lease be terminated early due to default by Tenant, the entire security deposit shall be immediately forfeited to the Landlord as liquidated damages, in addition to any other remedies available by law.",
        simplified: "If you leave early or are evicted for breaking the rules, the landlord keeps your entire security deposit, and they can still sue you for other damages or unpaid rent.",
        explanation: "Double-dipping (keeping the deposit and charging for early termination damages) is often illegal or highly unfavorable to the tenant.",
        renegotiate: "Negotiate an early termination clause where you pay a fixed 1-month or 2-month rent fee to break the lease early, and receive your security deposit back subject to normal wear-and-tear inspection."
      },
      {
        id: "r4",
        title: "Maintenance & Repairs",
        status: "safe",
        original: "The Landlord shall maintain the structural components, plumbing, electrical, and HVAC systems of the premises in good working order. Tenant shall keep the premises in a clean and sanitary condition and perform minor maintenance tasks under $50, such as replacing light bulbs.",
        simplified: "The landlord handles major repairs (pipes, wiring, heating/cooling), while you take care of cleanliness and minor fixes under $50 (like light bulbs).",
        explanation: "This is a balanced and standard maintenance clause that protects the tenant from paying for expensive structural failures.",
        renegotiate: "No changes needed. This is fair and standard."
      },
      {
        id: "r5",
        title: "Subletting Restrictions",
        status: "caution",
        original: "Tenant shall not assign this agreement, nor sublet the premises or any part thereof, without the prior written consent of the Landlord, which consent may be withheld in the Landlord's sole and absolute discretion.",
        simplified: "You cannot rent out a room or pass the lease to someone else unless the landlord agrees. The landlord can refuse your request for any reason or no reason at all.",
        explanation: "Absolute discretion allows the landlord to unreasonably deny a sublet even if you need to relocate for work or medical emergencies.",
        renegotiate: "Request that the landlord's consent 'shall not be unreasonably withheld, conditioned, or delayed.'"
      },
      {
        id: "r6",
        title: "Late Payment Penalties",
        status: "risky",
        original: "Rent is due on the 1st of each month. A late charge of $100 per day shall be assessed for any rent payment received after the 3rd of the month, compounding daily until full payment is rendered.",
        simplified: "Rent is late after the 3rd. You will be charged $100 per day for every day your rent is late, and it will compound daily.",
        explanation: "$100/day compounding is extremely punitive, likely usurious, and illegal in many jurisdictions.",
        renegotiate: "Propose a flat late fee of 5% of the monthly rent after a 5-day grace period, without compounding daily interest."
      },
      {
        id: "r7",
        title: "Quiet Enjoyment",
        status: "safe",
        original: "Landlord covenants that Tenant, upon paying the rent and performing the covenants herein, shall peaceably and quietly have, hold, and enjoy the premises for the term agreed without interference.",
        simplified: "As long as you pay rent and follow the lease rules, the landlord guarantees you can live in peace without interruption.",
        explanation: "This is a standard clause protecting your rights as a resident.",
        renegotiate: "No action required. This clause is safe."
      }
    ]
  },
  employment_contract: {
    name: "Senior Software Engineer Offer.pdf",
    type: "Employment Contract",
    healthScore: 55,
    stats: { risky: 4, caution: 2, safe: 3 },
    summary: "An employment agreement for a senior technical role. Contains aggressive IP ownership, broad non-compete covenants, and a strict termination clawback clause.",
    clauses: [
      {
        id: "e1",
        title: "Intellectual Property Assignment",
        status: "risky",
        original: "Employee hereby assigns to the Company all rights, title, and interest in and to any and all inventions, discoveries, designs, software code, and concepts, whether or not patentable, developed, conceived, or reduced to practice by Employee at any time during the term of employment, whether during business hours or off-duty, and whether or not utilizing Company resources.",
        simplified: "The company owns absolutely everything you build or invent while employed here, even if you make it in your free time, at home, and on your own computer, unrelated to your job.",
        explanation: "This is a highly restrictive 'all-inclusive' assignment that prevents you from working on side projects or personal startups.",
        renegotiate: "Limit IP assignment to inventions developed 'during work hours, using company equipment, or directly related to the company's business activities.'"
      },
      {
        id: "e2",
        title: "Non-Compete Restrictive Covenant",
        status: "risky",
        original: "For a period of 24 months following the termination of employment for any reason, Employee shall not, directly or indirectly, engage in, consult for, or perform services of any nature for any entity that competes directly or indirectly with the business of the Company within a 50-mile radius.",
        simplified: "After you leave, you cannot work for any competitor or start a competing business for 2 years anywhere within 50 miles.",
        explanation: "24 months is excessive. In many states/countries, non-competes are highly regulated, limited to 6-12 months, or outright banned (like in California or FTC proposals).",
        renegotiate: "Ask to remove the non-compete entirely, or reduce the duration to 6 months and limit it strictly to direct competitors."
      },
      {
        id: "e3",
        title: "Sign-on Bonus Clawback",
        status: "caution",
        original: "In the event that Employee terminates their employment with the Company, or is terminated for cause, within 12 months of the Start Date, Employee shall refund to the Company 100% of the gross Sign-on Bonus within 30 days of termination.",
        simplified: "If you quit or are fired for breaking rules within your first year, you must pay back 100% of your sign-on bonus immediately.",
        explanation: "It's common to have a clawback, but it should ideally be prorated monthly so you don't owe the full amount if you leave in month 11.",
        renegotiate: "Propose a prorated clawback (e.g., you pay back 1/12th less for every month you work)."
      },
      {
        id: "e4",
        title: "At-Will Employment",
        status: "safe",
        original: "Employment with the Company is 'at-will'. Either the Company or Employee may terminate the employment relationship at any time, for any reason or no reason, with or without prior notice or cause.",
        simplified: "You or the company can end the job at any time for any reason without prior notice.",
        explanation: "Standard in the United States. Allows flexibility but offers less job security.",
        renegotiate: "Consider asking for a standard notice period (e.g. 2 or 4 weeks) for termination without cause."
      },
      {
        id: "e5",
        title: "Arbitration of Disputes",
        status: "caution",
        original: "Any controversy or claim arising out of or relating to this agreement, or the breach thereof, shall be settled by binding arbitration in accordance with the rules of the American Arbitration Association, and judgment on the award rendered by the arbitrator(s) may be entered in any court having jurisdiction thereof. Employee waives the right to participate in class actions.",
        simplified: "You cannot sue the company in court. Any arguments must go to private arbitration, and you cannot join standard class-action lawsuits.",
        explanation: "Arbitration tends to favor employers and limits your legal recourse, including class actions.",
        renegotiate: "Request to retain the right to go to small claims court or opt out of class action waivers if state law permits."
      }
    ]
  },
  saas_terms: {
    name: "LegalLingo Cloud Terms.pdf",
    type: "SaaS Terms of Service",
    healthScore: 82,
    stats: { risky: 1, caution: 2, safe: 4 },
    summary: "Cloud service terms of use. Features standard limits on liability and IP license grants, with caution recommended for marketing data usage.",
    clauses: [
      {
        id: "s1",
        title: "Limitation of Liability Cap",
        status: "caution",
        original: "In no event shall the Provider's aggregate liability for all claims arising under this agreement exceed the total amount paid by the Customer to Provider in the twelve (12) months preceding the event giving rise to liability.",
        simplified: "If the software crashes or breaks your business, the most you can get back in damages is whatever you paid them in the last year.",
        explanation: "Very standard for SaaS, but can be problematic if a data breach causes significant damages far exceeding subscription costs.",
        renegotiate: "Propose a multiplier (e.g. 2x or 3x the annual fees) or carve-outs for data breaches and gross negligence."
      },
      {
        id: "s2",
        title: "Customer Data License Grant",
        status: "caution",
        original: "Customer grants to Provider a non-exclusive, worldwide, royalty-free, sublicensable license to host, copy, transmit, modify, and display Customer Data as necessary to provide the Services, and to analyze and use aggregate, de-identified data for marketing and product improvement purposes.",
        simplified: "You give them permission to host, edit, and move your files to run the service. They can also use your anonymized data for marketing and improving their product.",
        explanation: "Standard for hosting, but using your data for 'marketing' might raise privacy concerns for confidential legal papers.",
        renegotiate: "Ensure that document texts themselves cannot be used for training AI models or marketing, only aggregate usage statistics."
      },
      {
        id: "s3",
        title: "Warranty Disclaimer",
        status: "risky",
        original: "The services are provided 'as is' and 'as available' without warranty of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement. Provider does not warrant that the service will be error-free or uninterrupted.",
        simplified: "The software comes with no guarantees. If it doesn't work, has bugs, or goes offline, they are not legally responsible.",
        explanation: "This is a massive 'AS IS' disclaimer typical in software, but it frees them from any duty to perform.",
        renegotiate: "Negotiate a Service Level Agreement (SLA) guaranteeing 99.9% uptime with service credits if they fail."
      },
      {
        id: "s4",
        title: "IP Ownership",
        status: "safe",
        original: "Except for the limited license grants, Customer retains all right, title, and interest in and to the Customer Data. Provider retains all intellectual property rights in the Service and any software, designs, or improvements created by Provider.",
        simplified: "You own your data; they own their software and any upgrades they make. Neither side steals the other's intellectual property.",
        explanation: "A balanced and standard IP ownership clause that protects your proprietary files.",
        renegotiate: "No action required."
      }
    ]
  }
};
