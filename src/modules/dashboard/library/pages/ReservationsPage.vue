<template>
  <div>
    <el-card>
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1>Reservaciones</h1>
            <p class="page-description">Lista de reservaciones en la biblioteca</p>
          </div>
          <el-button type="primary" @click="openAddReservationDialog" :icon="Plus">
            Agregar Reservación
          </el-button>
        </div>
      </div>
      <div class="reservations-grid">
        <el-card
          v-for="reservation in enrichedReservations"
          :key="reservation.id"
          :body-style="{ padding: '0px' }"
          shadow="hover"
          class="reservation-card"
        >
          <div class="reservation-cover">
            <el-image
              :src="reservation.book?.cover"
              :alt="reservation.book?.title"
              fit="cover"
              class="cover-image"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="reservation-info">
            <h3 class="book-title">{{ reservation.book?.title || "Libro no encontrado" }}</h3>
            <div class="user-info">
              <el-avatar :size="32" :src="reservation.user?.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
              <span class="user-name">{{ reservation.user?.name || "Usuario no encontrado" }}</span>
            </div>
            <p class="reservation-date">
              <el-icon><Calendar /></el-icon>
              {{ formatDate(reservation.reservationDate) }}
            </p>
            <el-tag :type="getStatusType(reservation.status)" size="small" class="status-tag">
              {{ getStatusText(reservation.status) }}
            </el-tag>
            <div class="card-actions">
              <el-button
                type="primary"
                @click="openReservationDetails(reservation)"
                class="action-btn"
              >
                Ver más
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>

    <DrawerCustom
      v-model="drawerVisible"
      title="Detalles de la reservación"
      size="500px"
      :show-footer="false"
    >
      <div v-if="selectedReservation" class="reservation-details">
        <!-- Información del libro -->
        <div class="detail-section">
          <h3>Información del Libro</h3>
          <div class="detail-cover">
            <el-image
              :src="selectedReservation.book?.cover"
              :alt="selectedReservation.book?.title"
              fit="contain"
              class="detail-cover-image"
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Título">
              {{ selectedReservation.book?.title }}
            </el-descriptions-item>
            <el-descriptions-item label="Autor">
              {{ selectedReservation.book?.author }}
            </el-descriptions-item>
            <el-descriptions-item label="Género">
              {{ selectedReservation.book?.genre }}
            </el-descriptions-item>
            <el-descriptions-item label="Categoría">
              {{ selectedReservation.book?.category }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Información del usuario -->
        <div class="detail-section">
          <h3>Información del Usuario</h3>
          <div class="user-detail">
            <el-avatar :size="80" :src="selectedReservation.user?.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
          </div>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Nombre">
              {{ selectedReservation.user?.name }}
            </el-descriptions-item>
            <el-descriptions-item label="Email">
              {{ selectedReservation.user?.email }}
            </el-descriptions-item>
            <el-descriptions-item label="Teléfono">
              {{ selectedReservation.user?.phone }}
            </el-descriptions-item>
            <el-descriptions-item label="Departamento">
              {{ selectedReservation.user?.department }}
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Información de la reservación -->
        <div class="detail-section">
          <h3>Información de la Reservación</h3>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="ID de Reservación">
              #{{ selectedReservation.id }}
            </el-descriptions-item>
            <el-descriptions-item label="Fecha de reservación">
              {{ formatDate(selectedReservation.reservationDate) }}
            </el-descriptions-item>
            <el-descriptions-item label="Estado">
              <el-tag :type="getStatusType(selectedReservation.status)">
                {{ getStatusText(selectedReservation.status) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <!-- Botones de acción en el drawer de detalles -->
        <div class="drawer-actions">
          <el-button
            type="danger"
            @click="handleDeleteReservation(selectedReservation.id)"
            :icon="Delete"
          >
            Eliminar Reservación
          </el-button>
        </div>
      </div>
    </DrawerCustom>

    <!-- Drawer para agregar nueva reservación -->
    <DrawerCustom
      v-model="addDialogVisible"
      title="Agregar Nueva Reservación"
      size="500px"
      :show-footer="true"
      @confirm="handleAddReservation"
      @cancel="closeAddDialog"
    >
      <el-form :model="newReservation" label-position="top" ref="reservationFormRef">
        <el-form-item label="Libro" required>
          <el-select
            v-model="newReservation.bookId"
            placeholder="Selecciona un libro"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="book in booksStore.activeBooks"
              :key="book.id"
              :label="book.title"
              :value="book.id"
            >
              <div class="book-option">
                <span>{{ book.title }}</span>
                <span class="book-option-author">{{ book.author }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Usuario" required>
          <el-select
            v-model="newReservation.userId"
            placeholder="Selecciona un usuario"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="user in usersStore.activeUsers"
              :key="user.id"
              :label="user.name"
              :value="user.id"
            >
              <div class="user-option">
                <el-avatar :size="24" :src="user.avatar">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <span>{{ user.name }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="Fecha de Reservación" required>
          <el-date-picker
            v-model="newReservation.reservationDate"
            type="date"
            placeholder="Selecciona una fecha"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="Estado" required>
          <el-radio-group v-model="newReservation.status">
            <el-radio value="active">Activa</el-radio>
            <el-radio value="pending">Pendiente</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </DrawerCustom>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { Picture, User, Calendar, Plus, Delete } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import DrawerCustom from "@/components/ui/DrawerCustom.vue"
import { useReservationsStore } from "../store/ReservationsStore"
import { useBooksStore } from "../store/booksStore"
import { useUsersStore } from "../../users/store/usersStore"

const reservationsStore = useReservationsStore()
const booksStore = useBooksStore()
const usersStore = useUsersStore()

const drawerVisible = ref(false)
const selectedReservation = ref(null)
const addDialogVisible = ref(false)
const reservationFormRef = ref(null)

const newReservation = ref({
  bookId: null,
  userId: null,
  reservationDate: new Date().toISOString().split("T")[0],
  status: "active",
})

const enrichedReservations = computed(() => {
  return reservationsStore.allReservations.map((reservation) => ({
    ...reservation,
    book: booksStore.getBookById(reservation.bookId),
    user: usersStore.getUserById(reservation.userId),
  }))
})

const openReservationDetails = (reservation) => {
  selectedReservation.value = reservation
  drawerVisible.value = true
}

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("es-ES", options)
}

const getStatusType = (status) => {
  const statusTypes = {
    active: "success",
    pending: "warning",
    completed: "info",
    cancelled: "danger",
  }
  return statusTypes[status] || "info"
}

const getStatusText = (status) => {
  const statusTexts = {
    active: "Activa",
    pending: "Pendiente",
    completed: "Completada",
    cancelled: "Cancelada",
  }
  return statusTexts[status] || status
}

const openAddReservationDialog = () => {
  addDialogVisible.value = true
}

const closeAddDialog = () => {
  addDialogVisible.value = false
  newReservation.value = {
    bookId: null,
    userId: null,
    reservationDate: new Date().toISOString().split("T")[0],
    status: "active",
  }
}

const handleAddReservation = () => {
  if (!newReservation.value.bookId || !newReservation.value.userId) {
    ElMessage.warning("Por favor completa todos los campos requeridos")
    return
  }

  reservationsStore.addReservation(newReservation.value)
  ElMessage.success("Reservación agregada exitosamente")

  newReservation.value = {
    bookId: null,
    userId: null,
    reservationDate: new Date().toISOString().split("T")[0],
    status: "active",
  }
}

const handleDeleteReservation = (id) => {
  ElMessageBox.confirm(
    "¿Estás seguro de que deseas eliminar esta reservación?",
    "Confirmar eliminación",
    {
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      type: "warning",
    }
  )
    .then(() => {
      reservationsStore.deleteReservation(id)
      ElMessage.success("Reservación eliminada exitosamente")
      if (drawerVisible.value && selectedReservation.value?.id === id) {
        drawerVisible.value = false
      }
    })
    .catch(() => {})
}
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reservations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.reservation-card {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.reservation-card:hover {
  transform: translateY(-5px);
}

.reservation-cover {
  width: 100%;
  height: 300px;
  overflow: hidden;
  background-color: var(--app-bg-secondary);
}

.cover-image {
  width: 100%;
  height: 100%;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

.reservation-info {
  padding: 16px;
}

.book-title {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.reservation-date {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 8px 0;
  font-size: 13px;
  color: #666;
}

.status-tag {
  margin-bottom: 12px;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.action-btn {
  flex: 1;
}

/* Estilos del drawer */
.reservation-details {
  padding: 20px 0;
}

.detail-section {
  margin-bottom: 32px;
}

.detail-section h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
}

.detail-cover {
  width: 100%;
  height: 300px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.detail-cover-image {
  width: 100%;
  height: 100%;
}

.user-detail {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.drawer-actions {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
}

/* Estilos para las opciones del select */
.book-option {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.book-option-author {
  font-size: 12px;
  color: #909399;
}

.user-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-content .el-button {
    width: 100%;
  }

  .reservations-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .reservation-details {
    padding: 12px 0;
  }

  .detail-section {
    margin-bottom: 24px;
  }

  .detail-cover {
    height: 250px;
  }

  .drawer-actions {
    flex-direction: column;
  }

  .drawer-actions .el-button {
    width: 100%;
  }

  .card-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .reservation-cover {
    height: 200px;
  }

  .detail-cover {
    height: 200px;
  }

  .detail-section h3 {
    font-size: 16px;
  }
}
</style>
