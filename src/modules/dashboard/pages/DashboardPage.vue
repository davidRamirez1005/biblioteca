<template>
  <div>
    <el-card>
      <div class="page-header">
        <h1>Gestión de Biblioteca</h1>
        <p class="page-description">
          Administración de la biblioteca, incluyendo usuarios, reservas e inventario.
        </p>
      </div>
      <div class="dashboard-grid">
        <el-card @click="$router.push('/users/list')">
          <div>
            <el-icon><User /></el-icon>
            <h3>Usuarios</h3>
          </div>
        </el-card>

        <el-card @click="$router.push('/reservations')">
          <div>
            <el-icon><Calendar /></el-icon>
            <h3>Reservas</h3>
          </div>
        </el-card>

        <el-card @click="$router.push('/library/inventory')">
          <div>
            <el-icon><Notebook /></el-icon>
            <h3>Biblioteca</h3>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { User, Calendar, Notebook } from "@element-plus/icons-vue"
import { useRouter } from "vue-router"

const router = useRouter()
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.dashboard-grid .el-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.dashboard-grid .el-card > div {
  text-align: center;
  padding: 20px;
}

.dashboard-grid .el-icon {
  font-size: 28px;
  color: #409eff;
  margin-bottom: 16px;
}

.dashboard-grid h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .page-header h1 {
    font-size: 20px;
  }

  .page-description {
    font-size: 14px;
  }
}
</style>
