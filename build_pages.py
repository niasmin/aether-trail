# Builds index.html for GitHub Pages: game + Supabase backend shim (sb.js)
import os;os.chdir(os.path.dirname(os.path.abspath(__file__)))
s=open('aether-trail.html',encoding='utf-8').read()
sb=open('sb.js',encoding='utf-8').read()
head='''<!doctype html><html lang="th"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Aether Trail — เกม idle RPG ทีมฮีโร่ 4 คน">
<style>html,body{height:100%;margin:0;padding:0}body{background:#1b3a35}</style>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>
<script>'''+sb+'''</script>
</head><body>
'''
open('index.html','w',encoding='utf-8').write(head+s+'\n</body></html>\n')
print('index.html',len(head+s)//1024,'KB')
