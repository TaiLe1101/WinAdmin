import moment from "moment";
import { UpdateIsActiveVpcsLinkDTO, vpcsLinkAPI } from "@/apis/vpcs-link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ROUTES } from "@/configs/routes";
import { toast } from "@/hooks/use-toast";
import { VpcsLink } from "@/types/types";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

export default function VPCSLink() {
  const [vpcsLinks, setVpcsLinks] = useState<VpcsLink[]>([]);
  const [loadingDeleteBtn, setLoadingDeleteBtn] = useState<boolean>(false);

  useEffect(() => {
    const f = async () => {
      const result = await vpcsLinkAPI.getVpcsLinkAPI();
      setVpcsLinks(result.data);
    };
    f();
  }, []);

  async function deleteVpcsLink(id: string) {
    setLoadingDeleteBtn(true);
    const res = await vpcsLinkAPI.deleteVpcsLinkAPI(id);
    setLoadingDeleteBtn(false);
    if (res.statusCode === 204) {
      toast({
        title: "Delete",
        description: "Delete successfully",
      });
    } else {
      toast({
        title: "Delete",
        description: "Delete failed",
      });
    }
    const newVpcsLinks = vpcsLinks.filter((vpcsLink) => vpcsLink._id !== id);
    setVpcsLinks(newVpcsLinks);
  }

  const handleActive = async (
    id: string,
    reqBody: UpdateIsActiveVpcsLinkDTO
  ) => {
    // Hiển thị trạng thái loading cho từng switch
    const newVpcsLinks = vpcsLinks.map((vpcsLink) =>
      vpcsLink._id === id ? { ...vpcsLink, loading: true } : vpcsLink
    );
    setVpcsLinks(newVpcsLinks);

    try {
      const res = await vpcsLinkAPI.updateIsActiveVpcsLinkAPI(id, reqBody);
      if (res.statusCode === 200) {
        toast({
          title: "Update",
          description: "Update successfully",
        });

        // Cập nhật lại trạng thái isActive trong danh sách
        const updatedVpcsLinks = vpcsLinks.map((vpcsLink) =>
          vpcsLink._id === id
            ? { ...vpcsLink, isActive: reqBody.isActive, loading: false }
            : vpcsLink
        );
        setVpcsLinks(updatedVpcsLinks);
      } else {
        toast({
          title: "Update",
          description: "Update failed",
        });
      }
    } catch {
      toast({
        title: "Update",
        description: "Update failed",
      });
    }
  };

  return (
    <section className="bg-[#fff] shadow-md rounded-md p-4">
      <div className="flex gap-2 items-center">
        <h4>VPCS Link</h4>
        <Button asChild>
          <Link to={ROUTES.CREATE_VPCS_LINK}>Create new link</Link>
        </Button>
      </div>
      <Separator className="my-4" />
      <div>
        <Table>
          <TableCaption>VPCS Links</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] uppercase">SOCIAL</TableHead>
              <TableHead className="uppercase">Domain</TableHead>
              <TableHead className="uppercase">Link</TableHead>
              <TableHead className="uppercase">TOTAL CLICK</TableHead>
              <TableHead className="uppercase">Active</TableHead>
              <TableHead className="uppercase">Create</TableHead>
              <TableHead className="uppercase">Update</TableHead>
              <TableHead className="uppercase">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vpcsLinks &&
              vpcsLinks.map((vpcsLink) => (
                <TableRow key={vpcsLink._id}>
                  <TableCell className="font-medium">
                    {vpcsLink.social}
                  </TableCell>
                  <TableCell>{vpcsLink.domain}</TableCell>
                  <TableCell>
                    <a
                      href={`${vpcsLink.domain}f/${vpcsLink.slug}`}
                      target="_blank"
                      className="text-[#37AFE1]"
                    >{`${vpcsLink.domain}f/${vpcsLink.slug}`}</a>
                  </TableCell>
                  <TableCell>{vpcsLink.visitAmount}</TableCell>
                  <TableCell>
                    <Switch
                      checked={vpcsLink.isActive}
                      onClick={() => {
                        handleActive(vpcsLink._id, {
                          isActive: !vpcsLink.isActive,
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {moment(vpcsLink.createdAt).format("DD/MM/YYYY - hh:mm:ss")}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {moment(vpcsLink.updatedAt).format("DD/MM/YYYY - hh:mm:ss")}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button>Edit</Button>
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          deleteVpcsLink(vpcsLink._id);
                        }}
                        disabled={loadingDeleteBtn}
                      >
                        {loadingDeleteBtn && (
                          <>
                            <Loader2 className="animate-spin" /> Deleting...
                          </>
                        )}
                        {!loadingDeleteBtn && <>Delete</>}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
