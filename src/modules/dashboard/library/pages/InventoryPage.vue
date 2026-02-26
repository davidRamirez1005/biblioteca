<template>
  <div>
    <el-card>
      <div class="page-header">
        <h1>Inventario</h1>
        <p class="page-description">Lista de libros en la biblioteca</p>
      </div>
      <div class="books-grid">
        <el-card
          v-for="book in booksStore.activeBooks"
          :key="book.id"
          :body-style="{ padding: '0px' }"
          shadow="hover"
          class="book-card"
        >
          <div class="book-cover">
            <el-image :src="book.cover" :alt="book.title" fit="cover" class="cover-image">
              <template #error>
                <div class="image-slot">
                  <el-icon><Picture /></el-icon>
                </div>
              </template>
            </el-image>
          </div>
          <div class="book-info">
            <h3 class="book-title">{{ book.title }}</h3>
            <p class="book-author">{{ book.author }}</p>
            <p class="book-genre">{{ book.genre }}</p>
            <el-button type="primary" @click="openBookDetails(book)" class="view-more-btn">
              Ver más
            </el-button>
          </div>
        </el-card>
      </div>
    </el-card>

    <DrawerCustom
      v-model="drawerVisible"
      :title="selectedBook?.title || 'Detalles del libro'"
      size="500px"
      :show-footer="false"
    >
      <div v-if="selectedBook" class="book-details">
        <div class="detail-cover">
          <el-image
            :src="selectedBook.cover"
            :alt="selectedBook.title"
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

        <el-descriptions :column="1" border class="book-descriptions">
          <el-descriptions-item label="Título">
            {{ selectedBook.title }}
          </el-descriptions-item>
          <el-descriptions-item label="Autor">
            {{ selectedBook.author }}
          </el-descriptions-item>
          <el-descriptions-item label="Categoría">
            {{ selectedBook.category }}
          </el-descriptions-item>
          <el-descriptions-item label="Fecha de publicación">
            {{ formatDate(selectedBook.publishedDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="Estado">
            <el-tag :type="selectedBook.status === 1 ? 'success' : 'danger'">
              {{ selectedBook.status === 1 ? "Disponible" : "No disponible" }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="book-description-section">
          <h4>Descripción</h4>
          <p>{{ selectedBook.description }}</p>
        </div>
      </div>
    </DrawerCustom>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { Picture } from "@element-plus/icons-vue"
import DrawerCustom from "@/components/ui/DrawerCustom.vue"
import { useBooksStore } from "../store/booksStore"

const booksStore = useBooksStore()
const drawerVisible = ref(false)
const selectedBook = ref(null)

const openBookDetails = (book) => {
  selectedBook.value = book
  drawerVisible.value = true
}

const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("es-ES", options)
}
</script>

<style scoped>
.page-header {
  margin-bottom: 20px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.book-card {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-5px);
}

.book-cover {
  width: 100%;
  height: 350px;
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

.book-info {
  padding: 16px;
}

.book-title {
  margin: 0 0 8px 0;
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

.book-author {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #666;
}

.book-genre {
  margin: 0 0 12px 0;
  font-size: 12px;
  color: #909399;
}

.view-more-btn {
  width: 100%;
}

/* Estilos del drawer */
.book-details {
  padding: 20px 0;
}

.detail-cover {
  width: 100%;
  height: 400px;
  margin-bottom: 24px;
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

.book-descriptions {
  margin-bottom: 24px;
}

.book-description-section {
  margin-top: 24px;
}

.book-description-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
}

.book-description-section p {
  margin: 0;
  line-height: 1.6;
  color: #666;
  text-align: justify;
}

@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .book-details {
    padding: 12px 0;
  }

  .detail-cover {
    height: 250px;
  }

  .book-cover {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .book-cover {
    height: 200px;
  }

  .detail-cover {
    height: 200px;
  }

  .book-description-section h4 {
    font-size: 14px;
  }
}
</style>
