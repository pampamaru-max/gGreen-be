import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // ── Default accounts ────────────────────────────────────────────
  const accounts = [
    { email: 'superadmin@g-green.com', password: 'Sup3r@Grn!26',  name: 'Super Admin',    role: 'SUPERADMIN' as const },
    { email: 'admin@g-green.com',      password: 'Adm1n@Grn!26',  name: 'Admin',          role: 'ADMIN'      as const },
    { email: 'evaluator@g-green.com',  password: 'Ev@ltr@Grn!26', name: 'ผู้ประเมิน',     role: 'EVALUATOR'  as const },
    { email: 'evaluatee@g-green.com',  password: 'Ev@ltee@Grn!26', name: 'ผู้ถูกประเมิน', role: 'EVALUATEE'  as const },
  ];

  for (const acc of accounts) {
    const hashed = await bcrypt.hash(acc.password, 10);
    await prisma.user.upsert({
      where: { email: acc.email },
      update: {},
      create: { email: acc.email, password: hashed, name: acc.name, role: acc.role },
    });
  }
  // ────────────────────────────────────────────────────────────────


  // Categories
  await prisma.category.createMany({
    data: [
      { id: 1, name: 'กำหนดนโยบายและแผน', maxScore: 25, sortOrder: 1, isDefault: true },
      { id: 2, name: 'การสื่อสารและสร้างจิตสำนึก', maxScore: 15, sortOrder: 2, isDefault: true },
      { id: 3, name: 'ใช้ทรัพยากรและพลังงาน', maxScore: 15, sortOrder: 3, isDefault: true },
      { id: 4, name: 'การจัดการของเสีย', maxScore: 15, sortOrder: 4, isDefault: true },
    ],
    skipDuplicates: true,
  });

  // Topics
  await prisma.topic.createMany({
    data: [
      { id: '1.1', categoryId: 1, name: 'การกำหนดนโยบายสิ่งแวดล้อม', sortOrder: 1 },
      { id: '1.2', categoryId: 1, name: 'คณะทำงานด้านสิ่งแวดล้อม', sortOrder: 2 },
      { id: '1.3', categoryId: 1, name: 'การวิเคราะห์กิจกรรมที่ส่งผลกระทบ', sortOrder: 3 },
      { id: '1.4', categoryId: 1, name: 'กฎหมายและข้อกำหนดที่เกี่ยวข้อง', sortOrder: 4 },
      { id: '1.5', categoryId: 1, name: 'ข้อมูลก๊าซเรือนกระจก', sortOrder: 5 },
      { id: '1.6', categoryId: 1, name: 'แผนงานและเป้าหมาย', sortOrder: 6 },
      { id: '1.7', categoryId: 1, name: 'การติดตามและประเมินผล', sortOrder: 7 },
      { id: '2.1', categoryId: 2, name: 'การสื่อสารและเผยแพร่ข้อมูล', sortOrder: 1 },
      { id: '2.2', categoryId: 2, name: 'การรณรงค์สร้างจิตสำนึก', sortOrder: 2 },
      { id: '3.1', categoryId: 3, name: 'การใช้ไฟฟ้า', sortOrder: 1 },
      { id: '3.2', categoryId: 3, name: 'การใช้น้ำมันเชื้อเพลิง', sortOrder: 2 },
      { id: '3.3', categoryId: 3, name: 'การใช้น้ำ', sortOrder: 3 },
      { id: '3.4', categoryId: 3, name: 'การใช้กระดาษและทรัพยากรอื่นๆ', sortOrder: 4 },
      { id: '4.1', categoryId: 4, name: 'การจัดการขยะ', sortOrder: 1 },
      { id: '4.2', categoryId: 4, name: 'การจัดการน้ำเสีย', sortOrder: 2 },
    ],
    skipDuplicates: true,
  });

  // Indicators
  await prisma.indicator.createMany({
    data: [
      { id: '1.1.1', topicId: '1.1', name: 'มีการกำหนดนโยบายสิ่งแวดล้อมเป็นลายลักษณ์อักษร', maxScore: 4, sortOrder: 1 },
      { id: '1.1.2', topicId: '1.1', name: 'นโยบายมีการลงนามโดยผู้บริหารสูงสุด', maxScore: 4, sortOrder: 2 },
      { id: '1.1.3', topicId: '1.1', name: 'มีการสื่อสารนโยบายให้บุคลากรรับทราบ', maxScore: 4, sortOrder: 3 },
      { id: '1.1.4', topicId: '1.1', name: 'มีการทบทวนนโยบายอย่างสม่ำเสมอ', maxScore: 4, sortOrder: 4 },
      { id: '1.2.1', topicId: '1.2', name: 'มีการแต่งตั้งคณะทำงานด้านสิ่งแวดล้อม', maxScore: 4, sortOrder: 1 },
      { id: '1.2.2', topicId: '1.2', name: 'มีการกำหนดบทบาทหน้าที่ชัดเจน', maxScore: 4, sortOrder: 2 },
      { id: '1.3.1', topicId: '1.3', name: 'มีการระบุกิจกรรมที่ส่งผลกระทบต่อสิ่งแวดล้อม', maxScore: 4, sortOrder: 1 },
      { id: '1.3.2', topicId: '1.3', name: 'มีการประเมินผลกระทบด้านสิ่งแวดล้อม', maxScore: 4, sortOrder: 2 },
      { id: '1.3.3', topicId: '1.3', name: 'มีการจัดลำดับความสำคัญของปัญหา', maxScore: 4, sortOrder: 3 },
      { id: '1.4.1', topicId: '1.4', name: 'มีการรวบรวมกฎหมายด้านสิ่งแวดล้อมที่เกี่ยวข้อง', maxScore: 4, sortOrder: 1 },
      { id: '1.4.2', topicId: '1.4', name: 'มีการปฏิบัติตามกฎหมายอย่างครบถ้วน', maxScore: 4, sortOrder: 2 },
      { id: '1.5.1', topicId: '1.5', name: 'มีการเก็บข้อมูลการปล่อยก๊าซเรือนกระจก', maxScore: 4, sortOrder: 1 },
      { id: '1.5.2', topicId: '1.5', name: 'มีการวิเคราะห์ข้อมูลก๊าซเรือนกระจก', maxScore: 4, sortOrder: 2 },
      { id: '1.5.3', topicId: '1.5', name: 'มีแผนการลดก๊าซเรือนกระจก', maxScore: 4, sortOrder: 3 },
      { id: '1.6.1', topicId: '1.6', name: 'มีการกำหนดแผนงานด้านสิ่งแวดล้อม', maxScore: 4, sortOrder: 1 },
      { id: '1.6.2', topicId: '1.6', name: 'มีการกำหนดเป้าหมายที่ชัดเจนและวัดผลได้', maxScore: 4, sortOrder: 2 },
      { id: '1.7.1', topicId: '1.7', name: 'มีระบบการติดตามผลการดำเนินงาน', maxScore: 4, sortOrder: 1 },
      { id: '1.7.2', topicId: '1.7', name: 'มีการรายงานผลการดำเนินงานเป็นระยะ', maxScore: 4, sortOrder: 2 },
      { id: '2.1.1', topicId: '2.1', name: 'มีช่องทางการสื่อสารด้านสิ่งแวดล้อมที่หลากหลาย', maxScore: 4, sortOrder: 1 },
      { id: '2.1.2', topicId: '2.1', name: 'มีการเผยแพร่ข้อมูลด้านสิ่งแวดล้อมอย่างสม่ำเสมอ', maxScore: 4, sortOrder: 2 },
      { id: '2.2.1', topicId: '2.2', name: 'มีกิจกรรมรณรงค์สร้างจิตสำนึกด้านสิ่งแวดล้อม', maxScore: 4, sortOrder: 1 },
      { id: '3.1.1', topicId: '3.1', name: 'มีมาตรการประหยัดไฟฟ้า', maxScore: 4, sortOrder: 1 },
      { id: '3.1.2', topicId: '3.1', name: 'มีการติดตามปริมาณการใช้ไฟฟ้า', maxScore: 4, sortOrder: 2 },
      { id: '3.1.3', topicId: '3.1', name: 'ปริมาณการใช้ไฟฟ้าลดลง', maxScore: 4, sortOrder: 3 },
      { id: '3.2.1', topicId: '3.2', name: 'มีมาตรการประหยัดน้ำมันเชื้อเพลิง', maxScore: 4, sortOrder: 1 },
      { id: '3.2.2', topicId: '3.2', name: 'มีการติดตามปริมาณการใช้น้ำมัน', maxScore: 4, sortOrder: 2 },
      { id: '3.2.3', topicId: '3.2', name: 'มีการส่งเสริมการใช้พลังงานทดแทน', maxScore: 4, sortOrder: 3 },
      { id: '3.2.4', topicId: '3.2', name: 'มีการบำรุงรักษายานพาหนะอย่างสม่ำเสมอ', maxScore: 4, sortOrder: 4 },
      { id: '3.2.5', topicId: '3.2', name: 'ปริมาณการใช้น้ำมันเชื้อเพลิงลดลง', maxScore: 4, sortOrder: 5 },
      { id: '3.3.1', topicId: '3.3', name: 'มีมาตรการประหยัดน้ำ', maxScore: 4, sortOrder: 1 },
      { id: '3.3.2', topicId: '3.3', name: 'มีการติดตามปริมาณการใช้น้ำ', maxScore: 4, sortOrder: 2 },
      { id: '3.3.3', topicId: '3.3', name: 'มีการนำน้ำกลับมาใช้ใหม่', maxScore: 4, sortOrder: 3 },
      { id: '3.3.4', topicId: '3.3', name: 'มีการบำรุงรักษาระบบน้ำ', maxScore: 4, sortOrder: 4 },
      { id: '3.3.5', topicId: '3.3', name: 'ปริมาณการใช้น้ำลดลง', maxScore: 4, sortOrder: 5 },
      { id: '3.4.1', topicId: '3.4', name: 'มีมาตรการลดการใช้กระดาษและทรัพยากร', maxScore: 4, sortOrder: 1 },
      { id: '4.1.1', topicId: '4.1', name: 'มีการคัดแยกขยะตามประเภท', maxScore: 4, sortOrder: 1 },
      { id: '4.1.2', topicId: '4.1', name: 'มีการลดปริมาณขยะที่แหล่งกำเนิด', maxScore: 4, sortOrder: 2 },
      { id: '4.1.3', topicId: '4.1', name: 'ปริมาณขยะลดลง', maxScore: 4, sortOrder: 3 },
      { id: '4.2.1', topicId: '4.2', name: 'มีระบบบำบัดน้ำเสีย', maxScore: 4, sortOrder: 1 },
      { id: '4.2.2', topicId: '4.2', name: 'คุณภาพน้ำทิ้งเป็นไปตามมาตรฐาน', maxScore: 4, sortOrder: 2 },
    ],
    skipDuplicates: true,
  });

  // Scoring Levels
  await prisma.scoringLevel.createMany({
    data: [
      { name: 'ทอง (Gold)', minScore: 80, maxScore: 100, color: '#eab308', icon: 'trophy', sortOrder: 1 },
      { name: 'เงิน (Silver)', minScore: 60, maxScore: 79.99, color: '#9ca3af', icon: 'medal', sortOrder: 2 },
      { name: 'ทองแดง (Bronze)', minScore: 40, maxScore: 59.99, color: '#b45309', icon: 'award', sortOrder: 3 },
    ],
    skipDuplicates: true,
  });

  // Programs
  await prisma.program.createMany({
    data: [
      {
        id: 'green-hotel',
        name: 'Green Hotel',
        description: 'โรงแรมที่เป็นมิตรกับสิ่งแวดล้อม',
        icon: 'Building2',
        about: [{ type: 'text', content: 'โครงการ Green Hotel มุ่งเน้นการส่งเสริมให้โรงแรมและที่พักดำเนินกิจการอย่างเป็นมิตรกับสิ่งแวดล้อม ครอบคลุมการจัดการพลังงาน น้ำ ขยะ และมลพิษ เพื่อลดผลกระทบต่อสิ่งแวดล้อมและส่งเสริมการท่องเที่ยวอย่างยั่งยืน' }],
        guidelines: ['การจัดการพลังงานอย่างมีประสิทธิภาพ', 'การจัดการน้ำและน้ำเสีย', 'การจัดการขยะและของเสีย', 'การจัดซื้อจัดจ้างที่เป็นมิตรกับสิ่งแวดล้อม', 'การสร้างความตระหนักรู้ด้านสิ่งแวดล้อม'],
        reports: [],
        sortOrder: 0,
      },
      {
        id: 'green-restaurant',
        name: 'Green Restaurant',
        description: 'ร้านอาหารที่เป็นมิตรกับสิ่งแวดล้อม',
        icon: 'UtensilsCrossed',
        about: [{ type: 'text', content: 'โครงการ Green Restaurant ส่งเสริมให้ร้านอาหารมีการจัดการสิ่งแวดล้อมที่ดี ตั้งแต่การเลือกวัตถุดิบ การปรุงอาหาร จนถึงการจัดการขยะอาหาร เพื่อลดผลกระทบต่อสิ่งแวดล้อมจากธุรกิจอาหาร' }],
        guidelines: ['การเลือกใช้วัตถุดิบที่ปลอดภัยและยั่งยืน', 'การลดการใช้พลาสติกแบบใช้ครั้งเดียว', 'การจัดการขยะอาหารอย่างมีประสิทธิภาพ', 'การประหยัดพลังงานในการปรุงอาหาร', 'การสร้างบรรยากาศที่เป็นมิตรกับสิ่งแวดล้อม'],
        reports: [],
        sortOrder: 1,
      },
      {
        id: 'green-office',
        name: 'Green Office',
        description: 'สำนักงานสีเขียว',
        icon: 'Building2',
        about: [{ type: 'text', content: 'โครงการ Green Office มุ่งส่งเสริมให้สำนักงานมีการบริหารจัดการสิ่งแวดล้อมที่ดี เน้นการลดการใช้ทรัพยากร พลังงาน และลดการปล่อยก๊าซเรือนกระจก เพื่อนำไปสู่การเป็นสำนักงานที่เป็นมิตรกับสิ่งแวดล้อมอย่างยั่งยืน' }],
        guidelines: ['นโยบายด้านสิ่งแวดล้อม', 'การจัดการพลังงานและทรัพยากร', 'การจัดการของเสียและมลพิษ', 'สภาพแวดล้อมภายในและภายนอกสำนักงาน', 'การจัดซื้อจัดจ้างที่เป็นมิตรกับสิ่งแวดล้อม', 'การปรับปรุงอย่างต่อเนื่อง'],
        reports: [],
        sortOrder: 2,
      },
      {
        id: 'green-residence',
        name: 'Green Residence',
        description: 'ที่พักอาศัยสีเขียว',
        icon: 'Home',
        about: [{ type: 'text', content: 'โครงการ Green Residence ส่งเสริมให้ที่พักอาศัย หอพัก และคอนโดมิเนียมมีการจัดการสิ่งแวดล้อมที่ดี มุ่งเน้นความสะอาด ปลอดภัย และเป็นมิตรกับสิ่งแวดล้อม' }],
        guidelines: ['การจัดการพื้นที่สีเขียวภายในที่พัก', 'การจัดการขยะและการรีไซเคิล', 'การใช้พลังงานอย่างมีประสิทธิภาพ', 'การใช้น้ำอย่างประหยัด', 'การส่งเสริมคุณภาพชีวิตที่ดี'],
        reports: [],
        sortOrder: 3,
      },
      {
        id: 'green-production',
        name: 'Green Production',
        description: 'การผลิตที่เป็นมิตรกับสิ่งแวดล้อม',
        icon: 'Factory',
        about: [{ type: 'text', content: 'โครงการ Green Production มุ่งเน้นการส่งเสริมกระบวนการผลิตที่ลดผลกระทบต่อสิ่งแวดล้อม ใช้ทรัพยากรอย่างคุ้มค่า และลดของเสียจากกระบวนการผลิต' }],
        guidelines: ['การออกแบบผลิตภัณฑ์ที่เป็นมิตรกับสิ่งแวดล้อม', 'การเลือกใช้วัตถุดิบที่ยั่งยืน', 'การจัดการกระบวนการผลิตที่สะอาด', 'การจัดการของเสียจากกระบวนการผลิต', 'การลดการปล่อยมลพิษ'],
        reports: [],
        sortOrder: 4,
      },
      {
        id: 'green-national-park',
        name: 'Green National Park',
        description: 'อุทยานแห่งชาติสีเขียว',
        icon: 'Trees',
        about: [{ type: 'text', content: 'โครงการ Green National Park ส่งเสริมการจัดการอุทยานแห่งชาติอย่างยั่งยืน ลดผลกระทบจากการท่องเที่ยว และอนุรักษ์ทรัพยากรธรรมชาติและสิ่งแวดล้อม' }],
        guidelines: ['การจัดการพื้นที่อนุรักษ์อย่างยั่งยืน', 'การจัดการขยะในพื้นที่อุทยาน', 'การลดผลกระทบจากกิจกรรมท่องเที่ยว', 'การอนุรักษ์ทรัพยากรธรรมชาติ', 'การสร้างจิตสำนึกให้กับนักท่องเที่ยว'],
        reports: [],
        sortOrder: 5,
      },
      {
        id: 'g-upcycle',
        name: 'G-Upcycle',
        description: 'การนำวัสดุกลับมาใช้ใหม่',
        icon: 'Recycle',
        about: [{ type: 'text', content: 'โครงการ G-Upcycle ส่งเสริมการนำวัสดุเหลือใช้มาแปรรูปเพิ่มมูลค่า ลดปริมาณขยะ และส่งเสริมเศรษฐกิจหมุนเวียน' }],
        guidelines: ['การคัดแยกวัสดุที่สามารถนำกลับมาใช้ใหม่', 'การออกแบบและแปรรูปผลิตภัณฑ์จากวัสดุเหลือใช้', 'การสร้างมูลค่าเพิ่มจากของเหลือใช้', 'การส่งเสริมเศรษฐกิจหมุนเวียน'],
        reports: [],
        sortOrder: 6,
      },
      {
        id: 'eco-plus',
        name: 'Eco Plus',
        description: 'มาตรฐานสิ่งแวดล้อมขั้นสูง',
        icon: 'Award',
        about: [{ type: 'text', content: 'โครงการ Eco Plus เป็นมาตรฐานด้านสิ่งแวดล้อมขั้นสูงสำหรับองค์กรที่มีการจัดการสิ่งแวดล้อมดีเยี่ยม เป็นก้าวต่อไปหลังจากผ่านเกณฑ์ G-Green ระดับพื้นฐาน' }],
        guidelines: ['การบริหารจัดการสิ่งแวดล้อมเชิงรุก', 'การใช้นวัตกรรมเพื่อสิ่งแวดล้อม', 'การมีส่วนร่วมของชุมชนและผู้มีส่วนได้ส่วนเสีย', 'การติดตามและประเมินผลอย่างต่อเนื่อง'],
        reports: [],
        sortOrder: 7,
      },
      {
        id: 'green-hotel-plus',
        name: 'Green Hotel Plus',
        description: 'โรงแรมที่เป็นมิตรกับสิ่งแวดล้อมอย่างยั่งยืน',
        icon: 'Star',
        about: [{ type: 'text', content: 'โครงการ Green Hotel Plus เป็นมาตรฐานขั้นสูงสำหรับโรงแรมที่ผ่านเกณฑ์ Green Hotel แล้ว มุ่งเน้นความยั่งยืนในทุกมิติ ทั้งด้านเศรษฐกิจ สังคม และสิ่งแวดล้อม' }],
        guidelines: ['การจัดการพลังงานทดแทน', 'การลดคาร์บอนฟุตพริ้นท์', 'การจัดการห่วงโซ่อุปทานที่ยั่งยืน', 'การรายงานความยั่งยืนอย่างโปร่งใส', 'การสร้างคุณค่าให้กับชุมชนท้องถิ่น'],
        reports: [],
        sortOrder: 8,
      },
      {
        id: 'g-green-assessment',
        name: 'G-Green Assessment Unit',
        description: 'หน่วยรับดำเนินงานตรวจประเมิน G-Green',
        icon: 'ClipboardCheck',
        about: [{ type: 'text', content: 'หน่วยรับดำเนินงานตรวจประเมิน G-Green ทำหน้าที่ตรวจสอบและประเมินผลการดำเนินงานตามเกณฑ์ G-Green ขององค์กรต่าง ๆ เพื่อรับรองมาตรฐานด้านสิ่งแวดล้อม' }],
        guidelines: ['กระบวนการตรวจประเมินตามเกณฑ์มาตรฐาน', 'การจัดทำรายงานผลการตรวจประเมิน', 'การติดตามและให้คำแนะนำแก่หน่วยงานที่รับการประเมิน', 'การพัฒนาศักยภาพผู้ตรวจประเมิน'],
        reports: [],
        sortOrder: 9,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
