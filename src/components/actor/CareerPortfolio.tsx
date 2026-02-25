import React from "react";
import SectionWrapper from "../SectionWrapper";
import DraggableList from "../DraggableList";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CareerSection({ careers, setCareers }: any) {
  // 개별 항목 업데이트 함수
  const updateItem = (originalIndex: number, updates: any) => {
    const newCareers = [...careers];
    newCareers[originalIndex] = { ...newCareers[originalIndex], ...updates };
    setCareers(newCareers);
  };

  // 개별 항목 삭제 함수
  const removeItem = (originalIndex: number) => {
    setCareers(careers.filter((_: any, j: number) => j !== originalIndex));
  };

  // 특정 카테고리의 아이템들만 렌더링하는 헬퍼 함수
  const renderCareerList = (categoryFilter: string) => {
    // 필터링된 리스트 생성 (원본 인덱스를 유지해야 함)
    const filteredItems = careers
      .map((item: any, index: number) => ({ ...item, originalIndex: index }))
      .filter((item: any) => item.category === categoryFilter);

    if (filteredItems.length === 0) {
      return (
        <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white">
          <p className="text-slate-400 font-bold">이 카테고리에 등록된 항목이 없습니다.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() =>
              setCareers([
                ...careers,
                {
                  category: categoryFilter,
                  sub_category: "",
                  year_label: "",
                  title: "",
                  description: "",
                  role_image_url: "",
                  links: [],
                  images: [],
                },
              ])
            }
          >
            + 첫 항목 추가하기
          </Button>
        </div>
      );
    }

    return (
      <DraggableList
        items={filteredItems}
        droppableId={`careers-${categoryFilter}`}
        onReorder={(reorderedFilteredItems: any) => {
          // 순서 재배치 로직:
          // 1. 다른 카테고리 아이템들은 그대로 둠
          // 2. 현재 카테고리 아이템들만 새로운 순서로 교체
          const otherCategoryItems = careers.filter((c: any) => c.category !== categoryFilter);
          const newOrder = [
            ...otherCategoryItems,
            ...reorderedFilteredItems.map(({ originalIndex, ...rest }: any) => rest),
          ];
          // 사실 원본 배열에서의 전체 순서가 중요하다면 좀 더 복잡한 매핑이 필요하지만,
          // 보통 카테고리 내에서의 순서만 보장되면 되므로 합쳐줍니다.
          setCareers(newOrder);
        }}
        renderItem={(c: any) => {
          const i = c.originalIndex; // 원본 배열의 인덱스
          return (
            <div className="mb-6 p-6 border-2 border-slate-200 rounded-xl bg-white shadow-sm transition-all hover:border-primary/30">
              <div className="flex flex-wrap gap-3 items-start mb-5">
                <div className="bg-primary text-white px-3 py-1.5 rounded font-black text-[10px] uppercase">
                  {categoryFilter === "drama_film" ? "DRAMA & FILM" : "BRAND & ETC"}
                </div>
                <select
                  value={c.sub_category}
                  onChange={(e) => updateItem(i, { sub_category: e.target.value })}
                  className="border-2 border-slate-200 rounded-md px-2 py-2 text-xs font-black bg-slate-50 focus:border-primary outline-none"
                >
                  <option value="">구분 선택</option>
                  <option value="Drama">Drama</option>
                  <option value="Movie">Movie</option>
                  <option value="Editorial">Editorial</option>
                  <option value="MV">MV</option>
                  <option value="CF">CF</option>
                  <option value="etc">etc</option>
                </select>
                <Input
                  placeholder="연도"
                  value={c.year_label}
                  onChange={(e) => updateItem(i, { year_label: e.target.value })}
                  className="w-20 font-bold"
                />
                <Input
                  placeholder="작품명/활동명"
                  value={c.title}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                  className="flex-1 font-black"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(i)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  ✕
                </Button>
              </div>

              <div className="pl-4 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-[10px] font-black uppercase text-muted-foreground block mb-1">
                      배역명 (Description)
                    </Label>
                    <Input
                      placeholder="예: 김건 역"
                      value={c.description}
                      onChange={(e) => updateItem(i, { description: e.target.value })}
                      className="text-sm font-bold"
                    />
                  </div>
                  <div>
                    <Label className="text-[10px] font-black uppercase text-primary block mb-1">
                      배역 프로필 이미지 URL (호버 미리보기용)
                    </Label>
                    <Input
                      placeholder="이미지 URL"
                      value={c.role_image_url}
                      onChange={(e) => updateItem(i, { role_image_url: e.target.value })}
                      className="text-sm border-primary/20"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 space-y-3">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider text-left">
                    영상 및 외부 링크 관리
                  </p>
                  {c.links.map((link: any, li: number) => (
                    <div key={li} className="flex gap-2">
                      <Input
                        placeholder="라벨 (예: 예고편)"
                        value={link.link_label}
                        onChange={(e) => {
                          const newLinks = [...c.links];
                          newLinks[li].link_label = e.target.value;
                          updateItem(i, { links: newLinks });
                        }}
                        className="w-32 text-xs h-9 bg-white"
                      />
                      <Input
                        placeholder="URL"
                        value={link.link_url}
                        onChange={(e) => {
                          const newLinks = [...c.links];
                          newLinks[li].link_url = e.target.value;
                          updateItem(i, { links: newLinks });
                        }}
                        className="flex-1 text-xs h-9 bg-white"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newLinks = c.links.filter((_: any, j: number) => j !== li);
                          updateItem(i, { links: newLinks });
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newLinks = [...c.links, { link_url: "", link_label: "" }];
                      updateItem(i, { links: newLinks });
                    }}
                    className="text-[10px] font-bold bg-white"
                  >
                    + 링크 추가
                  </Button>
                </div>
              </div>
            </div>
          );
        }}
      />
    );
  };

  return (
    <SectionWrapper title="커리어 포트폴리오 관리">
      <Tabs defaultValue="drama_film" className="w-full">
        <TabsList className="mb-6 bg-slate-100 p-1">
          <TabsTrigger
            value="drama_film"
            className="flex-1 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-primary"
          >
            DRAMA & FILM ({careers.filter((c: any) => c.category === "drama_film").length})
          </TabsTrigger>
          <TabsTrigger
            value="brand_editorial"
            className="flex-1 font-bold text-xs data-[state=active]:bg-white data-[state=active]:text-primary"
          >
            BRAND & EDITORIAL ({careers.filter((c: any) => c.category === "brand_editorial").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="drama_film" className="focus-visible:outline-none">
          {renderCareerList("drama_film")}
          <Button
            variant="outline"
            className="w-full mt-4 py-6 border-dashed border-2 font-black text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
            onClick={() =>
              setCareers([
                ...careers,
                {
                  category: "drama_film",
                  sub_category: "",
                  year_label: "",
                  title: "",
                  description: "",
                  role_image_url: "",
                  links: [],
                  images: [],
                },
              ])
            }
          >
            + 새로운 작품(Drama/Film) 추가
          </Button>
        </TabsContent>

        <TabsContent value="brand_editorial" className="focus-visible:outline-none">
          {renderCareerList("brand_editorial")}
          <Button
            variant="outline"
            className="w-full mt-4 py-6 border-dashed border-2 font-black text-slate-400 hover:text-primary hover:bg-primary/5 transition-all"
            onClick={() =>
              setCareers([
                ...careers,
                {
                  category: "brand_editorial",
                  sub_category: "",
                  year_label: "",
                  title: "",
                  description: "",
                  role_image_url: "",
                  links: [],
                  images: [],
                },
              ])
            }
          >
            + 새로운 광고/화보(Brand/Editorial) 추가
          </Button>
        </TabsContent>
      </Tabs>
    </SectionWrapper>
  );
}
