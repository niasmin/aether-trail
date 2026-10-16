# Aether Trail

เกม idle RPG บนเว็บ (ภาษาไทย) ของมิน · เล่นจริงที่ artifact บน claude.ai: https://claude.ai/artifact/JWNdeWtDHf5NjfisXZt33o

## โครงสร้าง
| ไฟล์ | คืออะไร |
|---|---|
| `aether.src.html` | **ต้นฉบับหลัก** — HTML + CSS + JS ทั้งเกม ภาพอ้างเป็น `{{ชื่อภาพ}}` |
| `aether-trail.html` | ไฟล์เกมที่ประกอบแล้ว (ภาพอ้าง `assets/*.webp`) — ไฟล์ที่เผยแพร่ |
| `assets/` | ภาพทั้งหมด (.webp) 218+ ไฟล์ |
| `build.py` | ประกอบ `aether.src.html` → `aether-trail.html` แบบแยกไฟล์ภาพ |
| `build_embed.py` | ประกอบแบบฝังภาพทั้งหมดไว้ในไฟล์เดียว (สำรอง · ต้องไม่เกิน 16MB) |
| `modules/*.js` | สำเนาโค้ดแต่ละระบบ (ฝังอยู่ใน `aether.src.html` แล้ว เก็บไว้อ่านง่าย) |

### modules
- `guide.js` ปลดล็อก บทแนะนำ ไปทำต่อ ภารกิจประจำวัน · `kingdom.js` อาณาจักร · `petcv.js` สัตว์คู่หู + คาราวาน
- `gencraft.js` ศึกแม่ทัพ + ช่างฝีมือ · `dun.js` ดันเจี้ยน + ฉายา · `big3.js` ระดับทีมร่วม ห้องสะสม กระเป๋า บอสโลก
- `share.js` ส่งความเห็น สถิติผู้เล่น แผงผู้สร้าง · `offline.js` โหมดออฟไลน์ · `v3d.js` `v3plus.js` สนามรบ 3 มิติ (three.js r128)
- `home.js` หน้าเมือง · `avatar.js` อวาตาร์ + ตู้เสื้อผ้า · `me.js` ค่าสถานะ + อาชีพ · `walk.js` เดินในเมือง + เห็นผู้เล่นอื่น (room) · `field.js` ทุ่งล่ามอนสเตอร์

## วิธีประกอบ
```
python3 build.py        # ได้ aether-trail.html (ภาพอยู่ใน assets/)
```
เพิ่มภาพใหม่: วางไฟล์ใน `assets/` · เพิ่มชื่อในรายการของ `build.py` · เพิ่ม `ชื่อ:'{{ชื่อ}}'` ใน `const IMG={` ของ `aether.src.html`

## เผยแพร่
เผยแพร่ `aether-trail.html` พร้อมไฟล์ทั้งหมดใน `assets/` ไปที่ artifact เดิม (ใช้ความสามารถ db · user · comments · room)
เซฟผู้เล่นและข้อมูลออนไลน์ (แชท PvP บอสโลก) อยู่ในฐานข้อมูลของ artifact บน claude.ai ไม่ได้อยู่ใน repo นี้
