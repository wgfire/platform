import "./App.css";
import { useEffect, useState } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "./components/ui/button";
import { ExportService } from "./components/module/exportService";
import { ExportPreview, Preview } from "./components/module/Preview";
import { ExportForm, FormValues } from "./components/module/exportForm";

export interface initDataProps {
  id: string;
  name: string;
  width: number;
  height: number;
}
export default function App() {
  const [activeTab, setActiveTab] = useState("config");
  const [pageData, setPageData] = useState<initDataProps>({ id: "", name: "", width: 0, height: 0 });
  const [previewData, setPreviewData] = useState<ExportPreview[] | null>(null);
  const [formValues, setFormValues] = useState<FormValues | undefined>();
  const { id, name } = pageData;

  const exportHandel = () => {
    // window.open("https://www.bilibili.com/?spm_id_from=333.1007.0.0");
    // parent.postMessage({ pluginMessage: { type: "FigmaPreview" } }, "*");
  };

  useEffect(() => {
    parent.postMessage({ pluginMessage: { type: "init" } }, "*");
    window.onmessage = (event) => {
      console.log(event, "收到消息");
      const { type, data } = event.data.pluginMessage;
      if (type === "init") {
        console.log(data, "当前节点数据");
        setPageData(data);
        setFormValues({ id: data.id, name: data.name });
        parent.postMessage({ pluginMessage: { type: "FigmaPreview" } }, "*");
      }
      if (type === "FigmaPreview") {
        setPreviewData(data);
      }
    };
  }, []);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Go Blity Figma </h2>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">导出配置</TabsTrigger>
              <TabsTrigger value="service">导出服务</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{activeTab === "config" ? "配置信息" : "配置服务"}</h1>
            {<Button onClick={exportHandel}>导出</Button>}
          </div>

          {/**config */}
          {activeTab === "config" && (
            <>
              {<ExportForm defaultValues={{ id, name }} values={formValues}></ExportForm>}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">导出预览</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">{previewData && <Preview data={previewData} width={400}></Preview>}</div>
                </div>
              </div>
            </>
          )}

          {activeTab === "service" && (
            <ExportService
              onServiceDataChange={(data) => {
                console.log(data);
              }}
            ></ExportService>
          )}
        </div>
      </div>
    </div>
  );
}
