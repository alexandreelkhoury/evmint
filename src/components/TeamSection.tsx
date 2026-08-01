import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { colors, typography } from '../styles/designSystem'

interface TeamMember {
  name: string
  role: string
  avatar: string
  bio: string
  expertise: string[]
  social: {
    twitter?: string
    github?: string
    linkedin?: string
  }
  credentials: string[]
}

const teamMembers: TeamMember[] = [
  {
    name: "Alex Rivera",
    role: "Founder & CEO",
    avatar: "AR",
    bio: "10+ years in blockchain development. Former Lead Engineer at major DeFi protocol. Built infrastructure handling $2B+ in volume.",
    expertise: ["Smart Contracts", "DeFi Architecture", "Tokenomics"],
    social: {
      twitter: "#",
      github: "#"
    },
    credentials: ["Ex-Uniswap", "ETHGlobal Winner", "Solidity Expert"]
  },
  {
    name: "Nina Patel",
    role: "CTO",
    avatar: "NP",
    bio: "Web3 security specialist with 200+ smart contract audits. Previously at OpenZeppelin. Focus on creating bulletproof token contracts.",
    expertise: ["Security Auditing", "EVM Internals", "Gas Optimization"],
    social: {
      twitter: "#",
      github: "#"
    },
    credentials: ["Ex-OpenZeppelin", "Bug Bounty Hunter", "100+ Audits"]
  },
  {
    name: "Daniel Okoro",
    role: "Head of Product",
    avatar: "DO",
    bio: "UX designer turned Web3 product leader. Passionate about making crypto accessible to everyone. Previously at Coinbase.",
    expertise: ["Product Strategy", "UX Design", "User Research"],
    social: {
      twitter: "#",
      linkedin: "#"
    },
    credentials: ["Ex-Coinbase", "Design Lead", "10K+ Users Shipped"]
  },
  {
    name: "Laura Voss",
    role: "Head of Community",
    avatar: "LV",
    bio: "Community builder with experience scaling crypto communities from 0 to 100K. Strong focus on education and user success.",
    expertise: ["Community Building", "Growth Strategy", "Education"],
    social: {
      twitter: "#"
    },
    credentials: ["Ex-Discord Partner", "100K Community", "Growth Expert"]
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
}

export default function TeamSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 })

  return (
    <section
      ref={sectionRef}
      className="py-24 relative overflow-hidden"
      aria-labelledby="team-heading"
    >
      {/* Animated mesh gradient background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 mb-6"
          >
            <span className="text-sm font-medium text-pink-400">Our Team</span>
          </motion.div>

          <h2
            id="team-heading"
            className={`${typography.sectionTitle} text-3xl lg:text-4xl mb-6`}
          >
            Built by <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Industry Veterans</span>
          </h2>

          <p className={`${typography.subtitle} text-xl max-w-3xl mx-auto`}>
            Our team brings decades of combined experience from leading crypto companies,
            with a mission to democratize token creation for everyone.
          </p>
        </motion.div>

        {/* Team Grid - Asymmetric Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              variants={cardVariants}
              whileHover={{
                y: -8,
                transition: { type: "spring", stiffness: 300 }
              }}
              className={`group relative ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600/20 via-purple-500/20 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Card */}
              <div className={`relative ${colors.glassCard} rounded-2xl p-6 lg:p-8 h-full`}>
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Avatar with gradient border */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-0.5">
                      <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center text-white font-bold text-2xl lg:text-3xl">
                        {member.avatar}
                      </div>
                    </div>
                    {/* Online indicator */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-gray-900" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      {/* Social Links */}
                      <div className="flex gap-0 -ml-2">
                        {member.social.twitter && (
                          <a
                            href={member.social.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-blue-400 transition-colors cursor-pointer rounded-lg hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                            aria-label={`${member.name}'s Twitter`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                          </a>
                        )}
                        {member.social.github && (
                          <a
                            href={member.social.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                            aria-label={`${member.name}'s GitHub`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                          </a>
                        )}
                        {member.social.linkedin && (
                          <a
                            href={member.social.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-blue-500 transition-colors cursor-pointer rounded-lg hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:outline-none"
                            aria-label={`${member.name}'s LinkedIn`}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-purple-400 font-medium mb-3">{member.role}</p>

                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{member.bio}</p>

                    {/* Expertise Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {member.expertise.map(skill => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-xs text-purple-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Credentials */}
                    <div className="flex flex-wrap gap-2">
                      {member.credentials.map(cred => (
                        <span
                          key={cred}
                          className="px-3 py-1 bg-gradient-to-r from-gray-700/50 to-gray-600/50 rounded text-xs text-gray-300 font-mono"
                        >
                          {cred}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Company Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { value: "50+", label: "Years Combined Experience" },
            { value: "200+", label: "Smart Contract Audits" },
            { value: "10K+", label: "Tokens Deployed" },
            { value: "24/7", label: "Community Support" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
              className="text-center p-4"
            >
              <p className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-mono">
                {stat.value}
              </p>
              <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
