import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Input from "../../components/reka/Input.vue";

describe("Input.vue", () => {
  it('renders with default type "text"', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
      },
    });
    const input = wrapper.find("input");
    expect(input.attributes("type")).toBe("text");
  });

  it('renders with type "number"', () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 0,
        type: "number",
      },
    });
    const input = wrapper.find("input");
    expect(input.attributes("type")).toBe("number");
  });

  it("emits update:modelValue as string for text input", async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
        type: "text",
      },
    });

    const input = wrapper.find("input");
    await input.setValue("hello");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual(["hello"]);
  });

  it("emits update:modelValue as number for number input", async () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: 0,
        type: "number",
      },
    });

    const input = wrapper.find("input");
    // setValue with string still works because it's coerced to number in the component
    await input.setValue("42");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")![0]).toEqual([42]);
  });

  it("passes placeholder and attributes correctly", () => {
    const wrapper = mount(Input, {
      props: {
        modelValue: "",
        placeholder: "Type here...",
      },
      attrs: {
        id: "my-input",
        name: "username",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe("Type here...");
    expect(input.attributes("id")).toBe("my-input");
    expect(input.attributes("name")).toBe("username");
  });
});
