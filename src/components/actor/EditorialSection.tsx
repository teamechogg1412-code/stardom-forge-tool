import React from "react";
import SectionWrapper from "../SectionWrapper";
import DraggableList from "../DraggableList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// 주요 매거진 카테고리 정의
const MAGAZINE_CATEGORIES = [
  { id: "vogue", label: "VOGUE" },
  { id: "elle", label: "ELLE" },
  { id: "w", label: "W" },
  { id: "bazaar", label: "BAZAAR" },
  { id: "gq", label: "GQ" },
  { id: "other", label: "기타 매거진" },
];

export default function EditorialSection({ editorials, setEditorials }: any) {
  const updateEditorial = (index: number, updates: any) => {
    const n = [...editorials];
    n[index] = { ...n[index], ...updates };
    setEditorials(n);
  };

  const addMedia = (edIndex: number) => {
    const n = [...editorials];
    const currentMedia = n[edIndex].editorial_media || [];
    n[edIndex].editorial_media = [...currentMedia, { media_url: "", media_type: "image" }];
    setEditorials(n);
  };

  const updateMedia = (edIndex: number, mi: number, updates: any) => {
    const n = [...editorials];
    n[edIndex].editorial_media[mi] = { ...n[edIndex].editorial_media[mi], ...updates };
    setEditorials(n);
  };

  const renderEditorialList = (categoryKey: string) => {
    // 1. 해당 카테고리에 맞는 아이템 필터링 (기존 카테고리 정보가 없으면 'other'로 분류)
    const filtered = editorials
      .map((item: any, index: number) => ({ ...item, originalIndex: index }))
      .filter((item: any) => {
        if (categoryKey === "other") {
          return (
            !item.category || item.category === "other" || !MAGAZINE_CATEGORIES.find((c) => c.id === item.category)
          );
        }
        return item.category === categoryKey;
      });

    if (filtered.length === 0) {
      return (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white/50">
          <p className="text-slate-400 font-bold text-sm">해당 매거진의 화보가 없습니다.</p>
        </div>
      );
    }

    return (
      <DraggableList
        items={filtered}
        droppableId={`eds-${categoryKey}`}
        onReorder={(reordered: any) => {
          // 순서 변경 시 원본 배열 업데이트 로직 (간단화를 위해 합침)
          const others = editorials.filter(
            (_: any, idx: number) => !filtered.find((f: any) => f.originalIndex === idx),
          );
          setEditorials([...others, ...reordered.map(({ originalIndex, ...rest }: any) => rest)]);
        }}
        renderItem={(ed: any) => {
          const i = ed.originalIndex;
          return (
            <div className="mb-6 p-5 border-2 border-slate-200 rounded-xl bg-white shadow-sm text-left">
              <div className="flex gap-3 items-center mb-4">
                {/* 매체 카테고리 선택기 추가 */}
                <select
                  value={ed.category || "other"}
                  onChange={(e) => updateEditorial(i, { category: e.target.value })}
                  className="border-2 border-slate-100 rounded-md px-2 py-2 text-[10px] font-black bg-slate-800 text-white outline-none"
                >
                  {MAGAZINE_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                <Input
                  placeholder="연도"
                  value={ed.year_label}
                  onChange={(e) => updateEditorial(i, { year_label: e.target.value })}
                  className="w-20 font-bold h-9"
                />
                <Input
                  placeholder="매체 상세명 (예: W Korea 10월호)"
                  value={ed.media_name}
                  onChange={(e) => updateEditorial(i, { media_name: e.target.value })}
                  className="flex-1 font-bold h-9"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditorials(editorials.filter((_: any, j: number) => j !== i))}
                  className="text-destructive"
                >
                  ✕
                </Button>
              </div>

              <div className="pl-4 space-y-2">
                {ed.editorial_media?.map((m: any, mi: number) => (
                  <div key={mi} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="w-10 h-12 bg-white rounded border overflow-hidden flex-shrink-0">
                      {m.media_url && <img src={m.media_url} className="w-full h-full object-cover" />}
                    </div>
                    <select
                      value={m.media_type}
                      onChange={(e) => updateMedia(i, mi, { media_type: e.target.value })}
                      className="border border-slate-200 rounded px-1 py-1 text-[10px] font-bold outline-none"
                    >
                      <option value="image">IMG</option>
                      <option value="video">VIDEO</option>
                    </select>
                    <Input
                      placeholder="URL"
                      value={m.media_url}
                      onChange={(e) => updateMedia(i, mi, { media_url: e.target.value })}
                      className="flex-1 text-xs h-7"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const n = [...ed.editorial_media];
                        n.splice(mi, 1);
                        updateEditorial(i, { editorial_media: n });
                      }}
                      className="h-7 w-7 p-0 text-slate-400"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="xs" onClick={() => addMedia(i)} className="text-[10px] font-bold">
                  + 사진 추가
                </Button>
              </div>
            </div>
          );
        }}
      />
    );
  };

  return (
    <SectionWrapper title="화보 / 에디토리얼 관리">
      <Tabs defaultValue="vogue" className="w-full">
        {/* 매거진 탭 리스트 - 가로 스크롤 가능하게 구성 */}
        <div className="overflow-x-auto pb-2 mb-4">
          <TabsList className="flex w-max min-w-full bg-slate-100 p-1 h-auto">
            {MAGAZINE_CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                className="px-4 py-2 font-black text-[10px] data-[state=active]:bg-white data-[state=active]:text-primary"
              >
                {cat.label} (
                {
                  editorials.filter((e: any) =>
                    cat.id === "other" ? !e.category || e.category === "other" : e.category === cat.id,
                  ).length
                }
                )
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {MAGAZINE_CATEGORIES.map((cat) => (
          <TabsContent key={cat.id} value={cat.id} className="focus-visible:outline-none">
            {renderEditorialList(cat.id)}
            <Button
              variant="outline"
              className="w-full mt-4 py-4 border-dashed border-2 font-black text-slate-400 text-xs"
              onClick={() =>
                setEditorials([
                  ...editorials,
                  { year_label: "", media_name: "", category: cat.id, editorial_media: [] },
                ])
              }
            >
              + 새로운 {cat.label} 화보 추가
            </Button>
          </TabsContent>
        ))}
      </Tabs>
    </SectionWrapper>
  );
}
