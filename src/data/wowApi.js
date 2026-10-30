// WoW 애드온 API 미니 사전 (Retail 기준)
// 공식 문서: https://warcraft.wiki.gg/wiki/World_of_Warcraft_API

export const API_CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'unit', label: '유닛' },
  { id: 'event', label: '이벤트' },
  { id: 'frame', label: '프레임' },
  { id: 'chat', label: '채팅·명령어' },
  { id: 'world', label: '지역·파티' },
  { id: 'item', label: '아이템·주문' },
]

export const WOW_API = [
  {
    id: 'UnitName', category: 'unit', kind: 'function',
    name: 'UnitName', sig: 'UnitName(unit)',
    ko: '유닛의 이름을 돌려줍니다. "player", "target", "party1" 같은 유닛 ID를 넣어요.',
    returns: 'name, realm',
    lua: `local name, realm = UnitName("target")
print("대상:", name, realm or "같은 서버")`,
  },
  {
    id: 'UnitHealth', category: 'unit', kind: 'function',
    name: 'UnitHealth / UnitHealthMax', sig: 'UnitHealth(unit), UnitHealthMax(unit)',
    ko: '현재 체력과 최대 체력. 둘을 나누면 퍼센트가 나와요.',
    returns: 'number',
    lua: `local hp, max = UnitHealth("player"), UnitHealthMax("player")
print(string.format("체력 %d / %d (%.0f%%)", hp, max, hp / max * 100))`,
  },
  {
    id: 'UnitClass', category: 'unit', kind: 'function',
    name: 'UnitClass', sig: 'UnitClass(unit)',
    ko: '직업 이름(현지화), 영문 토큰, 직업 ID를 돌려줍니다. 토큰은 "WARRIOR", "MAGE"처럼 대문자예요.',
    returns: 'className, classFile, classId',
    lua: `local className, classFile = UnitClass("player")
print("내 직업:", className, "(" .. classFile .. ")")`,
  },
  {
    id: 'UnitLevel', category: 'unit', kind: 'function',
    name: 'UnitLevel / UnitExists', sig: 'UnitLevel(unit), UnitExists(unit)',
    ko: '레벨을 돌려줍니다. 대상이 없을 수도 있으니 UnitExists로 먼저 확인하는 습관!',
    returns: 'number / boolean',
    lua: `if UnitExists("target") then
  print("대상 레벨:", UnitLevel("target"))
else
  print("대상이 없어요")
end`,
  },
  {
    id: 'UnitAffectingCombat', category: 'unit', kind: 'function',
    name: 'UnitAffectingCombat', sig: 'UnitAffectingCombat(unit)',
    ko: '그 유닛이 지금 전투 중인지 알려줍니다.',
    returns: 'boolean',
    lua: `if UnitAffectingCombat("player") then
  print("전투 중! 집중!")
end`,
  },
  {
    id: 'PLAYER_LOGIN', category: 'event', kind: 'event',
    name: 'PLAYER_LOGIN', sig: 'event "PLAYER_LOGIN"',
    ko: '캐릭터 접속이 끝났을 때 한 번 발생. 애드온 초기화는 보통 여기서 해요.',
    returns: '—',
    lua: `local f = CreateFrame("Frame")
f:RegisterEvent("PLAYER_LOGIN")
f:SetScript("OnEvent", function()
  print("어서오세요, " .. UnitName("player") .. "!")
end)`,
  },
  {
    id: 'PLAYER_TARGET_CHANGED', category: 'event', kind: 'event',
    name: 'PLAYER_TARGET_CHANGED', sig: 'event "PLAYER_TARGET_CHANGED"',
    ko: '대상을 바꾸거나 해제할 때 발생. 대상 정보 표시 애드온의 시작점.',
    returns: '—',
    lua: `local f = CreateFrame("Frame")
f:RegisterEvent("PLAYER_TARGET_CHANGED")
f:SetScript("OnEvent", function()
  if UnitExists("target") then print("새 대상:", UnitName("target")) end
end)`,
  },
  {
    id: 'PLAYER_REGEN', category: 'event', kind: 'event',
    name: 'PLAYER_REGEN_DISABLED / ENABLED', sig: 'event "PLAYER_REGEN_DISABLED", "PLAYER_REGEN_ENABLED"',
    ko: '전투 시작(DISABLED) / 전투 종료(ENABLED). 이름이 반대 같지만 "체력 재생이 꺼졌다 = 전투"라고 외우면 돼요.',
    returns: '—',
    lua: `local f = CreateFrame("Frame")
f:RegisterEvent("PLAYER_REGEN_DISABLED")
f:RegisterEvent("PLAYER_REGEN_ENABLED")
f:SetScript("OnEvent", function(_, event)
  print(event == "PLAYER_REGEN_DISABLED" and "⚔ 전투 시작" or "✿ 전투 끝")
end)`,
  },
  {
    id: 'PLAYER_LEVEL_UP', category: 'event', kind: 'event',
    name: 'PLAYER_LEVEL_UP', sig: 'event "PLAYER_LEVEL_UP" (level, ...)',
    ko: '레벨업 순간 발생. 첫 번째 인자가 새 레벨이에요.',
    returns: 'level',
    lua: `local f = CreateFrame("Frame")
f:RegisterEvent("PLAYER_LEVEL_UP")
f:SetScript("OnEvent", function(_, _, level)
  print("🎉 레벨 " .. level .. " 달성!")
end)`,
  },
  {
    id: 'CreateFrame', category: 'frame', kind: 'function',
    name: 'CreateFrame', sig: 'CreateFrame(type, name, parent, template)',
    ko: '모든 UI의 기본 단위. 이벤트를 받으려면 보이지 않는 프레임이라도 하나 필요해요.',
    returns: 'frame',
    lua: `local box = CreateFrame("Frame", "MyBox", UIParent, "BackdropTemplate")
box:SetSize(120, 40)
box:SetPoint("CENTER")
box.text = box:CreateFontString(nil, "OVERLAY", "GameFontNormal")
box.text:SetPoint("CENTER")
box.text:SetText("안녕 ✿")`,
  },
  {
    id: 'SetScript', category: 'frame', kind: 'function',
    name: 'frame:SetScript', sig: 'frame:SetScript(handler, func)',
    ko: '"OnEvent", "OnUpdate", "OnClick" 같은 핸들러에 함수를 붙입니다.',
    returns: '—',
    lua: `local btn = CreateFrame("Button", nil, UIParent, "UIPanelButtonTemplate")
btn:SetSize(100, 24)
btn:SetPoint("CENTER")
btn:SetText("눌러봐")
btn:SetScript("OnClick", function() print("눌렀다!") end)`,
  },
  {
    id: 'C_Timer', category: 'frame', kind: 'function',
    name: 'C_Timer.After', sig: 'C_Timer.After(seconds, func)',
    ko: '몇 초 뒤에 함수를 한 번 실행. 반복은 C_Timer.NewTicker.',
    returns: '—',
    lua: `C_Timer.After(3, function()
  print("3초 지났어요")
end)
C_Timer.NewTicker(60, function() print("1분마다") end)`,
  },
  {
    id: 'print', category: 'chat', kind: 'function',
    name: 'print', sig: 'print(...)',
    ko: '채팅창에 출력. |cffRRGGBB ... |r 로 색도 넣을 수 있어요.',
    returns: '—',
    lua: `print("|cffff9dcc[WOW DIARY]|r 분홍색 글씨 ✿")`,
  },
  {
    id: 'SlashCmd', category: 'chat', kind: 'function',
    name: 'SlashCmdList', sig: 'SLASH_NAME1 = "/cmd"; SlashCmdList["NAME"] = func',
    ko: '/명령어 만들기. 전역 변수 SLASH_이름1, 2… 에 명령어를, SlashCmdList에 함수를 넣어요.',
    returns: '—',
    lua: `SLASH_HELLO1 = "/hello"
SLASH_HELLO2 = "/안녕"
SlashCmdList["HELLO"] = function(msg)
  print("안녕! 입력한 말:", msg)
end`,
  },
  {
    id: 'SendChatMessage', category: 'chat', kind: 'function',
    name: 'SendChatMessage', sig: 'SendChatMessage(msg, chatType, language, target)',
    ko: '채팅 보내기. chatType은 "SAY", "PARTY", "GUILD", "WHISPER" 등. 버튼 클릭 같은 사용자 동작 안에서만 가능해요.',
    returns: '—',
    lua: `SendChatMessage("파티 모집해요 ✿", "SAY")
SendChatMessage("안녕!", "WHISPER", nil, "친구이름")`,
  },
  {
    id: 'GetRealZoneText', category: 'world', kind: 'function',
    name: 'GetRealZoneText / GetMinimapZoneText', sig: 'GetRealZoneText(), GetMinimapZoneText()',
    ko: '지금 있는 지역 이름(큰 지역 / 미니맵 세부 지역).',
    returns: 'string',
    lua: `print(GetRealZoneText(), "-", GetMinimapZoneText())`,
  },
  {
    id: 'ZONE_CHANGED', category: 'event', kind: 'event',
    name: 'ZONE_CHANGED_NEW_AREA', sig: 'event "ZONE_CHANGED_NEW_AREA"',
    ko: '새로운 지역으로 들어갔을 때. 탐험 일기 애드온에 딱이에요.',
    returns: '—',
    lua: `local f = CreateFrame("Frame")
f:RegisterEvent("ZONE_CHANGED_NEW_AREA")
f:SetScript("OnEvent", function()
  print("✦ 도착:", GetRealZoneText())
end)`,
  },
  {
    id: 'IsInGroup', category: 'world', kind: 'function',
    name: 'IsInGroup / IsInRaid / GetNumGroupMembers', sig: 'IsInGroup(), IsInRaid(), GetNumGroupMembers()',
    ko: '파티·공격대 여부와 인원 수.',
    returns: 'boolean / number',
    lua: `if IsInRaid() then
  print("공격대", GetNumGroupMembers(), "명")
elseif IsInGroup() then
  print("파티", GetNumGroupMembers(), "명")
else
  print("혼자 모험 중")
end`,
  },
  {
    id: 'C_Map', category: 'world', kind: 'function',
    name: 'C_Map.GetPlayerMapPosition', sig: 'C_Map.GetPlayerMapPosition(mapID, unit)',
    ko: '지도 위 내 좌표(0~1). 100을 곱하면 흔히 말하는 좌표가 돼요.',
    returns: 'vector2 (x, y)',
    lua: `local mapID = C_Map.GetBestMapForUnit("player")
local pos = C_Map.GetPlayerMapPosition(mapID, "player")
if pos then
  print(string.format("좌표 %.1f, %.1f", pos.x * 100, pos.y * 100))
end`,
  },
  {
    id: 'GetMoney', category: 'item', kind: 'function',
    name: 'GetMoney', sig: 'GetMoney()',
    ko: '가진 돈(구리 단위). C_CurrencyInfo.GetCoinTextureString으로 골드 아이콘 포함 문자열로 바꿀 수 있어요.',
    returns: 'copper',
    lua: `local copper = GetMoney()
print("내 돈:", C_CurrencyInfo.GetCoinTextureString(copper))
print("골드로:", math.floor(copper / 10000))`,
  },
  {
    id: 'GetItemInfo', category: 'item', kind: 'function',
    name: 'C_Item.GetItemInfo', sig: 'C_Item.GetItemInfo(itemID | link | name)',
    ko: '아이템 정보. 처음 조회하면 nil이 올 수 있어서(캐시 전) 잠시 뒤 다시 부르는 패턴을 써요.',
    returns: 'name, link, quality, iLvl, reqLevel, type, subType, stack, equipLoc, icon, sellPrice, ...',
    lua: `local name, link, quality, ilvl = C_Item.GetItemInfo(6948) -- 귀환석
if name then print(link, "품질", quality, "아이템 레벨", ilvl) end`,
  },
  {
    id: 'GetSpellInfo', category: 'item', kind: 'function',
    name: 'C_Spell.GetSpellInfo', sig: 'C_Spell.GetSpellInfo(spellID)',
    ko: '주문 정보를 테이블로 돌려줍니다. (예전 GetSpellInfo는 사라졌어요.)',
    returns: 'table { name, iconID, castTime, minRange, maxRange, spellID }',
    lua: `local info = C_Spell.GetSpellInfo(133) -- 화염구
if info then print(info.name, "시전", info.castTime / 1000, "초") end`,
  },
  {
    id: 'PlaySound', category: 'frame', kind: 'function',
    name: 'PlaySound', sig: 'PlaySound(soundKitID, channel)',
    ko: '게임 내 효과음 재생. 8959는 레이드 경고음, 888은 레벨업 소리예요.',
    returns: 'willPlay, handle',
    lua: `PlaySound(888) -- 레벨업!
PlaySound(8959, "Master") -- 레이드 경고`,
  },
  {
    id: 'GetInventoryItemLink', category: 'item', kind: 'function',
    name: 'GetInventoryItemLink', sig: 'GetInventoryItemLink(unit, slotID)',
    ko: '장비칸에 낀 아이템 링크. 비어 있으면 nil. 슬롯 번호는 1 머리, 2 목, 3 어깨, 5 가슴 … 16 주장비, 17 보조장비.',
    returns: 'itemLink | nil',
    lua: `local link = GetInventoryItemLink("player", 1) -- 머리
if link then
  print("머리:", link, "아이템 레벨", C_Item.GetDetailedItemLevelInfo(link))
else
  print("머리 칸이 비어 있어요!")
end`,
  },
  {
    id: 'C_Container', category: 'item', kind: 'function',
    name: 'C_Container.GetContainerItemID', sig: 'C_Container.GetContainerNumSlots(bag), C_Container.GetContainerItemID(bag, slot)',
    ko: '가방 뒤지기. 가방 번호 0(기본 가방)~4, 칸은 1부터. 특정 아이템을 갖고 있는지 확인할 때 써요.',
    returns: 'itemID | nil',
    lua: `local function HasItem(wantID)
  for bag = 0, 4 do
    for slot = 1, C_Container.GetContainerNumSlots(bag) do
      if C_Container.GetContainerItemID(bag, slot) == wantID then return true end
    end
  end
end
print("귀환석 있음?", HasItem(6948) and "응" or "아니")`,
  },
  {
    id: 'BAG_UPDATE_DELAYED', category: 'event', kind: 'event',
    name: 'BAG_UPDATE_DELAYED', sig: 'event "BAG_UPDATE_DELAYED"',
    ko: '가방 내용이 바뀌고 잠시 뒤 한 번 발생. 아이템을 주웠는지 확인하기에 BAG_UPDATE보다 가벼워요.',
    returns: '—',
    lua: `local f = CreateFrame("Frame")
f:RegisterEvent("BAG_UPDATE_DELAYED")
f:SetScript("OnEvent", function()
  print("가방이 바뀌었어요")
end)`,
  },
  {
    id: 'SavedVariables', category: 'frame', kind: 'function',
    name: 'SavedVariables (.toc)', sig: '## SavedVariables: MyAddonDB',
    ko: '로그아웃해도 남는 저장소. .toc에 한 줄 적으면 그 이름의 전역 테이블이 자동으로 저장·복원돼요. 위시리스트, 설정 등에 사용.',
    returns: '—',
    lua: `-- MyAddon.toc 에 추가:  ## SavedVariables: MyAddonDB
local f = CreateFrame("Frame")
f:RegisterEvent("PLAYER_LOGIN")
f:SetScript("OnEvent", function()
  MyAddonDB = MyAddonDB or { visits = 0 } -- 처음이면 만들기
  MyAddonDB.visits = MyAddonDB.visits + 1
  print("접속 횟수:", MyAddonDB.visits)
end)`,
  },
]


// ---- 애드온 생성기 ----
// 각 기능은 이벤트별 코드(on), 상단 보조 코드(setup), /명령어 하위 명령(slash)을 가질 수 있고,
// 생성기가 같은 이벤트·명령어를 하나로 합쳐요. {NAME}은 애드온 이름으로 치환됩니다.

export const ADDON_FEATURES = [
  {
    id: 'login', label: '접속 인사', hint: 'PLAYER_LOGIN · UnitName · print',
    uses: ['PLAYER_LOGIN', 'UnitName', 'print'],
    on: { PLAYER_LOGIN: ['Say("안녕, " .. UnitName("player") .. "! 오늘도 낭만 모험 ✿")'] },
  },
  {
    id: 'target', label: '대상 체력 알려주기', hint: 'PLAYER_TARGET_CHANGED · UnitHealth',
    uses: ['PLAYER_TARGET_CHANGED', 'UnitHealth', 'UnitLevel'],
    on: {
      PLAYER_TARGET_CHANGED: [
        'if UnitExists("target") then',
        '  local hp, max = UnitHealth("target"), UnitHealthMax("target")',
        '  Say(string.format("%s  %d / %d (%.0f%%)", UnitName("target"), hp, max, hp / max * 100))',
        'end',
      ],
    },
  },
  {
    id: 'combat', label: '전투 시작·종료 알림', hint: 'PLAYER_REGEN_DISABLED / ENABLED',
    uses: ['PLAYER_REGEN'],
    on: {
      PLAYER_REGEN_DISABLED: ['Say("⚔ 전투 시작! 바닥 조심")'],
      PLAYER_REGEN_ENABLED: ['Say("✿ 전투 끝. 한숨 돌리기")'],
    },
  },
  {
    id: 'levelup', label: '레벨업 축하', hint: 'PLAYER_LEVEL_UP · PlaySound',
    uses: ['PLAYER_LEVEL_UP', 'PlaySound'],
    on: { PLAYER_LEVEL_UP: ['local level = ...', 'PlaySound(888)', 'Say("🎉 레벨 " .. level .. "! 축하해")'] },
  },
  {
    id: 'zone', label: '새 지역 도착 기록', hint: 'ZONE_CHANGED_NEW_AREA · GetRealZoneText',
    uses: ['ZONE_CHANGED', 'GetRealZoneText'],
    on: { ZONE_CHANGED_NEW_AREA: ['Say("✦ 도착: " .. GetRealZoneText())'] },
  },
  {
    id: 'nextitem', label: '다음 필요한 아이템 알려주기', hint: 'GetInventoryItemLink · BAG_UPDATE_DELAYED · SavedVariables',
    uses: ['GetInventoryItemLink', 'C_Container', 'BAG_UPDATE_DELAYED', 'SavedVariables', 'SlashCmd', 'GetItemInfo'],
    savedVariables: true,
    setup: `-- 장비칸 번호와 이름
local SLOTS = {
  {1, "머리"}, {2, "목"}, {3, "어깨"}, {15, "등"}, {5, "가슴"}, {9, "손목"}, {10, "손"},
  {6, "허리"}, {7, "다리"}, {8, "발"}, {11, "반지1"}, {12, "반지2"},
  {13, "장신구1"}, {14, "장신구2"}, {16, "주장비"}, {17, "보조장비"}, {18, "원거리"},
}

local function ItemLevelOf(link)
  if C_Item and C_Item.GetDetailedItemLevelInfo then
    return C_Item.GetDetailedItemLevelInfo(link) or 0
  end
  local info = (C_Item and C_Item.GetItemInfo) or GetItemInfo
  return select(4, info(link)) or 0
end

-- 비어 있는 칸 + 아이템 레벨이 가장 낮은 칸 = 다음에 필요한 아이템
local function NextItem()
  local empty, lowest = {}, nil
  for _, s in ipairs(SLOTS) do
    local link = GetInventoryItemLink("player", s[1])
    if not link then
      table.insert(empty, s[2])
    else
      local ilvl = ItemLevelOf(link)
      if not lowest or ilvl < lowest.ilvl then
        lowest = { name = s[2], ilvl = ilvl, link = link }
      end
    end
  end
  if #empty > 0 then Say("비어 있는 칸: " .. table.concat(empty, ", ")) end
  if lowest then
    Say(string.format("다음으로 바꿀 아이템 → %s (지금 %s, 아이템 레벨 %d)", lowest.name, lowest.link, lowest.ilvl))
  end
  local wish = {NAME}DB and {NAME}DB.wish
  if wish and next(wish) then
    local names = {}
    for _, name in pairs(wish) do table.insert(names, name) end
    Say("찾는 중: " .. table.concat(names, ", "))
  end
end

-- 가방에 위시리스트 아이템이 들어왔는지 확인
local function WishlistCheck()
  local wish = {NAME}DB and {NAME}DB.wish
  if not wish or not next(wish) then return end
  for bag = 0, 4 do
    for slot = 1, (C_Container.GetContainerNumSlots(bag) or 0) do
      local id = C_Container.GetContainerItemID(bag, slot)
      if id and wish[id] then
        PlaySound(888)
        Say("✿ 찾던 아이템 획득! " .. wish[id])
        wish[id] = nil
      end
    end
  end
end`,
    on: {
      PLAYER_LOGIN: ['{NAME}DB = {NAME}DB or { wish = {} }', 'C_Timer.After(3, NextItem)'],
      BAG_UPDATE_DELAYED: ['WishlistCheck()'],
    },
    slash: {
      next: { help: '다음 필요한 아이템 보기', body: ['NextItem()'] },
      want: {
        help: '[아이템링크] 위시리스트에 추가 (Shift+클릭으로 링크 넣기)',
        body: [
          'local id = tonumber(rest:match("item:(%d+)"))',
          'if id then',
          '  local name = C_Item.GetItemInfo(id) or ("item:" .. id)',
          '  {NAME}DB.wish[id] = name',
          '  Say("위시리스트 추가: " .. name)',
          'else',
          '  Say("아이템을 Shift+클릭해서 넣어주세요: /{CMD} want [아이템]")',
          'end',
        ],
      },
      list: {
        help: '위시리스트 보기',
        body: [
          'local n = 0',
          'for id, name in pairs({NAME}DB.wish) do n = n + 1; Say(n .. ". " .. name) end',
          'if n == 0 then Say("위시리스트가 비어 있어요. /{CMD} want [아이템] 으로 추가!") end',
        ],
      },
    },
  },
  {
    id: 'slash', label: '/명령어로 내 돈 보기', hint: 'SlashCmdList · GetMoney',
    uses: ['SlashCmd', 'GetMoney'],
    slash: { money: { help: '가진 돈 보기', body: ['Say("가진 돈: " .. C_CurrencyInfo.GetCoinTextureString(GetMoney()))'] } },
  },
]

const sanitizeName = (raw) => {
  const cleaned = raw.replace(/[^A-Za-z0-9]/g, '')
  const name = cleaned || 'WowDiary'
  return /^[0-9]/.test(name) ? `A${name}` : name
}

const indent = (lines, depth) => lines.map((l) => (l ? ' '.repeat(depth) + l : l))

export function buildAddon(rawName, selectedIds) {
  const name = sanitizeName(rawName)
  const cmd = name.toLowerCase()
  const fill = (s) => s.replaceAll('{NAME}', name).replaceAll('{CMD}', cmd)
  const features = ADDON_FEATURES.filter((f) => selectedIds.includes(f.id))

  // 이벤트별로 코드 합치기 (기능 순서 유지)
  const events = new Map()
  features.forEach((f) => Object.entries(f.on || {}).forEach(([ev, body]) => {
    if (!events.has(ev)) events.set(ev, [])
    events.get(ev).push(...body)
  }))
  const slashCmds = Object.assign({}, ...features.map((f) => f.slash || {}))
  const hasSlash = Object.keys(slashCmds).length > 0
  const savedVars = features.some((f) => f.savedVariables)

  const toc = `## Interface: 16001
## Title: |cffff9dcc${name}|r
## Notes: WOW DIARY 애드온 공방에서 만든 첫 애드온 ✿
## Author: 낭만 와공쥬
## Version: 0.1.0${savedVars ? `\n## SavedVariables: ${name}DB` : ''}
# 16001 = 포에버(1.60.x). 다르면 게임 안에서 /dump select(4, GetBuildInfo()) 값으로 바꿔주세요.

${name}.lua
`

  const lines = [
    `-- ${name}.lua`,
    `-- WOW DIARY 애드온 공방에서 생성 · 수정은 자유롭게!`,
    `local ADDON_NAME = ...`,
    ``,
    `local function Say(msg)`,
    `  print("|cffff9dcc[" .. ADDON_NAME .. "]|r " .. msg)`,
    `end`,
  ]

  features.filter((f) => f.setup).forEach((f) => lines.push(``, fill(f.setup)))

  if (events.size > 0) {
    lines.push(``, `local frame = CreateFrame("Frame")`)
    events.forEach((_, ev) => lines.push(`frame:RegisterEvent("${ev}")`))
    lines.push(``, `frame:SetScript("OnEvent", function(self, event, ...)`)
    let first = true
    events.forEach((body, ev) => {
      lines.push(`  ${first ? 'if' : 'elseif'} event == "${ev}" then`, ...indent(body.map(fill), 4))
      first = false
    })
    lines.push(`  end`, `end)`)
  }

  if (hasSlash) {
    const key = name.toUpperCase()
    const help = Object.entries(slashCmds).map(([sub, c]) => `/${cmd} ${sub} — ${c.help}`).join('  |  ')
    lines.push(``, `SLASH_${key}1 = "/${cmd}"`, `SlashCmdList["${key}"] = function(msg)`,
      `  local sub, rest = msg:match("^(%S*)%s*(.-)$")`)
    let first = true
    Object.entries(slashCmds).forEach(([sub, c]) => {
      lines.push(`  ${first ? 'if' : 'elseif'} sub == "${sub}" then`, ...indent(c.body.map(fill), 4))
      first = false
    })
    lines.push(`  else`, `    Say("명령어: ${fill(help)}")`, `  end`, `end`)
  }

  if (events.size === 0 && !hasSlash) {
    lines.push(``, `-- 왼쪽에서 기능을 하나 골라보세요 ✿`)
  }

  return { name, toc, lua: lines.join('\n') + '\n', uses: [...new Set(features.flatMap((f) => f.uses))] }
}
