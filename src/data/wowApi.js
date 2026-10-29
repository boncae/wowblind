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
]

export const ADDON_FEATURES = [
  {
    id: 'login', label: '접속 인사', hint: 'PLAYER_LOGIN · UnitName · print',
    events: ['PLAYER_LOGIN'], uses: ['PLAYER_LOGIN', 'UnitName', 'print'],
    handler: `  if event == "PLAYER_LOGIN" then
    Say("안녕, " .. UnitName("player") .. "! 오늘도 낭만 모험 ✿")`,
  },
  {
    id: 'target', label: '대상 체력 알려주기', hint: 'PLAYER_TARGET_CHANGED · UnitHealth',
    events: ['PLAYER_TARGET_CHANGED'], uses: ['PLAYER_TARGET_CHANGED', 'UnitHealth', 'UnitLevel'],
    handler: `  if event == "PLAYER_TARGET_CHANGED" and UnitExists("target") then
    local hp, max = UnitHealth("target"), UnitHealthMax("target")
    Say(string.format("%s  %d / %d (%.0f%%)", UnitName("target"), hp, max, hp / max * 100))`,
  },
  {
    id: 'combat', label: '전투 시작·종료 알림', hint: 'PLAYER_REGEN_DISABLED / ENABLED',
    events: ['PLAYER_REGEN_DISABLED', 'PLAYER_REGEN_ENABLED'], uses: ['PLAYER_REGEN'],
    handler: `  if event == "PLAYER_REGEN_DISABLED" then
    Say("⚔ 전투 시작! 바닥 조심")
  elseif event == "PLAYER_REGEN_ENABLED" then
    Say("✿ 전투 끝. 한숨 돌리기")`,
  },
  {
    id: 'levelup', label: '레벨업 축하', hint: 'PLAYER_LEVEL_UP · PlaySound',
    events: ['PLAYER_LEVEL_UP'], uses: ['PLAYER_LEVEL_UP', 'PlaySound'],
    handler: `  if event == "PLAYER_LEVEL_UP" then
    local level = ...
    PlaySound(888)
    Say("🎉 레벨 " .. level .. "! 축하해")`,
  },
  {
    id: 'zone', label: '새 지역 도착 기록', hint: 'ZONE_CHANGED_NEW_AREA · GetRealZoneText',
    events: ['ZONE_CHANGED_NEW_AREA'], uses: ['ZONE_CHANGED', 'GetRealZoneText'],
    handler: `  if event == "ZONE_CHANGED_NEW_AREA" then
    Say("✦ 도착: " .. GetRealZoneText())`,
  },
  {
    id: 'slash', label: '/명령어로 내 돈 보기', hint: 'SlashCmdList · GetMoney',
    events: [], uses: ['SlashCmd', 'GetMoney'],
    slash: true,
  },
]

const sanitizeName = (raw) => {
  const cleaned = raw.replace(/[^A-Za-z0-9]/g, '')
  const name = cleaned || 'WowDiary'
  return /^[0-9]/.test(name) ? `A${name}` : name
}

export function buildAddon(rawName, selectedIds) {
  const name = sanitizeName(rawName)
  const features = ADDON_FEATURES.filter((f) => selectedIds.includes(f.id))
  const events = [...new Set(features.flatMap((f) => f.events))]
  const handlers = features.filter((f) => f.handler)
  const slash = features.find((f) => f.slash)

  const toc = `## Interface: 120000
## Title: |cffff9dcc${name}|r
## Notes: WOW DIARY 애드온 공방에서 만든 첫 애드온 ✿
## Author: 낭만 와공쥬
## Version: 0.1.0
# Interface 숫자는 게임 안에서 /dump select(4, GetBuildInfo()) 로 확인한 값으로 바꿔주세요.

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

  if (events.length > 0) {
    lines.push(``, `local frame = CreateFrame("Frame")`)
    events.forEach((e) => lines.push(`frame:RegisterEvent("${e}")`))
    lines.push(``, `frame:SetScript("OnEvent", function(self, event, ...)`)
    handlers.forEach((f, i) => {
      const body = i === 0 ? f.handler : f.handler.replace(/^ {2}if /, '  elseif ')
      lines.push(body)
    })
    lines.push(`  end`, `end)`)
  }

  if (slash) {
    const key = name.toUpperCase()
    lines.push(
      ``,
      `SLASH_${key}1 = "/${name.toLowerCase()}"`,
      `SlashCmdList["${key}"] = function(msg)`,
      `  Say("가진 돈: " .. C_CurrencyInfo.GetCoinTextureString(GetMoney()))`,
      `end`,
    )
  }

  if (events.length === 0 && !slash) {
    lines.push(``, `-- 왼쪽에서 기능을 하나 골라보세요 ✿`)
  }

  return { name, toc, lua: lines.join('\n') + '\n', uses: [...new Set(features.flatMap((f) => f.uses))] }
}
