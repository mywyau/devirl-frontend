import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ConfirmDialog from '../../components/reka/ConfirmDialog.vue'

describe('ConfirmDialog.vue', () => {
  it('renders the trigger button with correct text', () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        title: 'Delete Item',
        description: 'Are you sure?',
        triggerText: 'Delete',
      },
    })

    const button = wrapper.get('button')
    expect(button.text()).toBe('Delete')
  })

  it('opens the dialog when trigger is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        title: 'Delete Item',
        description: 'Are you sure?',
        triggerText: 'Delete',
      },
      attachTo: document.body, // important for teleport
    })

    expect(document.body.innerHTML).not.toContain('Delete Item')

    await wrapper.get('button').trigger('click')
    await nextTick()

    expect(document.body.innerHTML).toContain('Delete Item')
    expect(document.body.innerHTML).toContain('Are you sure?')

    wrapper.unmount()
  })

  it('emits confirm when Confirm button is clicked', async () => {
    const wrapper = mount(ConfirmDialog, {
      props: {
        title: 'Delete Item',
        description: 'Are you sure?',
        triggerText: 'Delete',
        actionText: 'Yes, delete',
      },
      attachTo: document.body,
    })

    await wrapper.get('button').trigger('click')
    await nextTick()

    // Find all buttons in the body after the dialog is opened
    const confirmButton = [...document.body.querySelectorAll('button')].find(
      (btn) => btn.textContent?.includes('Yes, delete')
    )

    expect(confirmButton).toBeTruthy()
    confirmButton?.click()
    await nextTick()

    expect(wrapper.emitted('confirm')).toBeTruthy()
    wrapper.unmount()
  })
})
