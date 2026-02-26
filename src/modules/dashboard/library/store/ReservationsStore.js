import { defineStore } from "pinia"
import { ref, computed } from "vue"

const initialReservations = [
  {
    id: 1,
    bookId: 1,
    userId: 1,
    reservationDate: "2024-06-01",
    status: "active",
  },
  {
    id: 2,
    bookId: 2,
    userId: 2,
    reservationDate: "2024-06-02",
    status: "active",
  },
  {
    id: 3,
    bookId: 3,
    userId: 3,
    reservationDate: "2024-06-03",
    status: "active",
  },
]

export const useReservationsStore = defineStore("reservations", () => {
  const reservations = ref([...initialReservations])

  const allReservations = computed(() => reservations.value)
  const activeReservations = computed(() => reservations.value.filter((r) => r.status === "active"))

  const addReservation = (reservation) => {
    const newId = Math.max(...reservations.value.map((r) => r.id), 0) + 1
    reservations.value.push({ ...reservation, id: newId })
  }

  const updateReservation = (id, updatedReservation) => {
    const index = reservations.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      reservations.value[index] = { ...reservations.value[index], ...updatedReservation }
    }
  }

  const deleteReservation = (id) => {
    const index = reservations.value.findIndex((r) => r.id === id)
    if (index !== -1) {
      reservations.value.splice(index, 1)
    }
  }

  return {
    reservations,
    allReservations,
    activeReservations,
    addReservation,
    updateReservation,
    deleteReservation,
  }
})
