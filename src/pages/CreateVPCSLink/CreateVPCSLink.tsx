import { vpcsLinkAPI } from "@/apis/vpcs-link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const createVPCSLinkSchema = z.object({
  slug: z.string().min(1).max(50),
  domain: z.string().min(1).max(255),
  destinationUrl: z.array(z.string().min(1).max(255)),
  social: z.string().min(1).max(50),
  variantUrl: z.string().min(1).max(50),
  timeOut: z.string(),
  isAsChild: z.boolean(),
});

export default function CreateVPCSLink() {
  const [isChildrenUrl, setIsChildrenUrl] = useState(false);
  const [destinationUrls, setDestinationUrls] = useState<string[]>([""]);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const currentHost = window.location.origin + "/";

  const form = useForm<z.infer<typeof createVPCSLinkSchema>>({
    resolver: zodResolver(createVPCSLinkSchema),
    defaultValues: {
      slug: "",
      domain: currentHost,
      destinationUrl: [""],
      social: "NONE",
      variantUrl: "PERSON",
      timeOut: "30000",
      isAsChild: false,
    },
  });

  function addDestinationUrl() {
    setDestinationUrls([...destinationUrls, ""]); // Thêm một URL rỗng vào mảng
  }

  function removeDestinationUrl(index: number) {
    const updatedDestinationUrls = destinationUrls.filter(
      (_, i) => i !== index
    );
    setDestinationUrls(updatedDestinationUrls);
  }

  function handleDestinationUrlChange(index: number, value: string) {
    const updatedDestinationUrls = [...destinationUrls];
    updatedDestinationUrls[index] = value; // Cập nhật giá trị của URL
    setDestinationUrls(updatedDestinationUrls);
  }

  async function onSubmit(values: z.infer<typeof createVPCSLinkSchema>) {
    setLoading(true);
    const res = await vpcsLinkAPI.createVpcsLinkAPI(values);
    setLoading(false);
    if (res.statusCode === 201) {
      toast({
        title: "Create",
        description: "Create Success",
      });
      form.reset();
    } else {
      toast({
        title: "Create",
        description: "Create Error",
      });
    }
  }

  return (
    <section className="bg-[#fff] shadow-md rounded-md p-4">
      <div className="flex gap-2 items-center">
        <h4>
          <strong>Create VPCS Link</strong>
        </h4>
      </div>
      <Separator className="my-4" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" {...field} />
                </FormControl>
                <FormDescription>
                  This is slug ex: https://example.com/:slug
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isAsChild"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Children URL</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setIsChildrenUrl(checked);
                      }}
                      id="isChild"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isChildrenUrl && (
            <>
              <Button type="button" size={"sm"} onClick={addDestinationUrl}>
                + Add URL
              </Button>
              {destinationUrls.map((url, index) => (
                <div key={index} className="space-y-2">
                  <FormField
                    control={form.control}
                    name={`destinationUrl.${index}`} // Đặt tên cho từng trường
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination URL {index + 1}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Destination URL"
                            value={url}
                            onChange={(e) => {
                              field.onChange(e.target.value);
                              handleDestinationUrlChange(index, e.target.value);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    size={"sm"}
                    onClick={() => removeDestinationUrl(index)}
                    className="bg-red-500 text-white"
                  >
                    Xoá
                  </Button>
                </div>
              ))}
            </>
          )}
          {!isChildrenUrl && (
            <FormField
              control={form.control}
              name="destinationUrl.0" // Lấy phần tử đầu tiên của mảng
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Destination URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Destination URL"
                      value={destinationUrls[0]} // Hiển thị giá trị của phần tử đầu tiên
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleDestinationUrlChange(0, e.target.value); // Cập nhật giá trị của phần tử đầu tiên
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="timeOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <div className="flex items-center gap-1">
                    TimeOut (Recommend: 30000ms){" "}
                    <Info size={12} color="#0D92F4" />
                  </div>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Time(s)" {...field} />
                </FormControl>
                <FormDescription>
                  This is time redirect to url (ms)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a domain" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Domain</SelectLabel>
                        <SelectItem value={currentHost}>
                          {currentHost}
                        </SelectItem>
                        <SelectItem value="https://gaidep.baby/">
                          https://gaidep.baby/
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>This is domain</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="social"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Social</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a social" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Social</SelectLabel>
                        <SelectItem value="NONE">None</SelectItem>
                        <SelectItem value="FACEBOOK">Facebook</SelectItem>
                        <SelectItem value="LINE">Line</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>This is social</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="variantUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Variant URL</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a variant url" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Variant URL</SelectLabel>
                        <SelectItem value="PERSON">Person</SelectItem>
                        <SelectItem value="GROUP">Group</SelectItem>
                        <SelectItem value="URL">URL</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>This is variant</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {loading && (
              <>
                <Loader2 className="animate-spin" /> Creating...
              </>
            )}
            {!loading && <>Create</>}
          </Button>
        </form>
      </Form>
    </section>
  );
}
