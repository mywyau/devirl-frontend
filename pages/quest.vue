<script setup>
const { isAuthenticated, loginWithRedirect } = useAuth0()

onMounted(() => {
  if (!isAuthenticated.value) {
    loginWithRedirect()
  }
})
</script>
