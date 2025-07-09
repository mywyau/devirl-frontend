import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TextArea from "../../components/reka/TextArea.vue";

describe("TextArea.vue", () => {
  it("renders with default rows", () => {
    const wrapper = mount(TextArea, {
      props: {
        modelValue: "",
      },
    });

    const textarea = wrapper.find("textarea");
    expect(textarea.attributes("rows")).toBe("6"); // default
  });

  it("renders with custom row count", () => {
    const wrapper = mount(TextArea, {
      props: {
        modelValue: "",
        rows: 10,
      },
    });

    const textarea = wrapper.find("textarea");
    expect(textarea.attributes("rows")).toBe("10");
  });

  it("renders with placeholder", () => {
    const wrapper = mount(TextArea, {
      props: {
        modelValue: "",
        placeholder: "Write something...",
      },
    });

    const textarea = wrapper.find("textarea");
    expect(textarea.attributes("placeholder")).toBe("Write something...");
  });

  it("emits update:modelValue on input", async () => {
    const wrapper = mount(TextArea, {
      props: {
        modelValue: "",
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.setValue("Hello, world!");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual(["Hello, world!"]);
  });

  it("shows correct modelValue", () => {
    const wrapper = mount(TextArea, {
      props: {
        modelValue: "Initial text",
      },
    });

    const textarea = wrapper.find("textarea");
    expect((textarea.element as HTMLTextAreaElement).value).toBe(
      "Initial text"
    );
  });
});
