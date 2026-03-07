const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const email = 'doctor@abha.com'

    // Find and fix the existing account
    const user = await prisma.user.findUnique({ where: { email }, include: { doctor: true } })

    if (!user) {
        console.log('User not found, creating fresh account...')
        const passwordHash = await bcrypt.hash('doctor123', 12)
        const newUser = await prisma.user.create({
            data: {
                name: 'Dr. Anjali Sharma',
                email,
                passwordHash,
                role: 'DOCTOR',
                doctor: {
                    create: { specialty: 'General Practitioner', hospital: 'AIIMS Delhi', licenseNumber: 'MCI-12345' }
                }
            }
        })
        console.log('Created! ID:', newUser.id)
    } else {
        // Fix the role
        await prisma.user.update({ where: { email }, data: { role: 'DOCTOR' } })
        console.log('Fixed role to DOCTOR. User ID:', user.id)

        // Ensure Doctor profile exists
        if (!user.doctor) {
            await prisma.doctor.create({
                data: { userId: user.id, specialty: 'General Practitioner', hospital: 'AIIMS Delhi', licenseNumber: 'MCI-12345' }
            })
            console.log('Created Doctor profile.')
        } else {
            console.log('Doctor profile already exists.')
        }
    }

    // Verify
    const verified = await prisma.user.findUnique({ where: { email }, include: { doctor: true } })
    console.log('\n✅ VERIFIED:')
    console.log('  Email:', verified.email)
    console.log('  Role:', verified.role)
    console.log('  Doctor Profile:', verified.doctor ? `${verified.doctor.specialty} @ ${verified.doctor.hospital}` : 'MISSING')
    console.log('\n--- LOGIN CREDENTIALS ---')
    console.log('  Email:    doctor@abha.com')
    console.log('  Password: doctor123')
    console.log('  URL:      http://localhost:3000/doctor/login')
}

main().catch(console.error).finally(() => prisma.$disconnect())
