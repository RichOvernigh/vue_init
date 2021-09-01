<template>
  <div class="app-container">
    <el-form
      v-show="showSearch"
      ref="queryForm"
      class="form"
      :model="queryParams"
      :inline="true"
      label-width="120px"
    >
      <el-row :gutter="20">
        <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
          <el-form-item label="时间">
            <el-date-picker
              v-model="dateRange"
              size="small"
              style="width: 100%"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="6" :xl="6">
          <el-form-item label="收款分类">
            <el-select
              v-model="queryParams.incomeType"
              style="width: 100%;"
              placeholder="请选择"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            >
              <el-option
                v-for="dict in income_type"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="8" :sm="8" :md="8" :lg="12" :xl="12" class="text-right">
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              size="mini"
              @click="handleQuery"
            >搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>
    <div class="total-content">
      <div class="total-item">合计</div>
      <div class="total-item">{{ list.totalAmountOfIncome||0 }}</div>
      <div class="total-item">{{ list.totalCumulativeRefund||0 }}</div>
    </div>
    <el-table v-loading="loading" style="width: 100%" :data="list.collectionDailyList">
      <el-table-column label="收款渠道（内部）" align="center" prop="paymentType">
        <div slot-scope="{row}">{{ dictFormatter(row.paymentType) }}({{ row.companyName }})
          <!-- -{{ incomeTypeDictFormatter(row.incomeType) }} -->
        </div>
      </el-table-column>
      <el-table-column label="累计收入（元）" align="center" prop="amountOfIncome" />
      <el-table-column label="累计退款（元）" align="center" prop="cumulativeRefund" />
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/finance/daily';
import { deepClone } from '@/utils';
export default {
  name: 'Financedaily',
  data() {
    return {
      list: [],
      // 日期范围
      dateRange: [],
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      queryParams: {},
      income_channel: [],
      income_type: []
    };
  },
  mounted() {
    this.getList();
    this.getDicts('income_channel').then(({ data }) => {
      this.income_channel = data;
    });
    this.getDicts('income_type').then(({ data }) => {
      this.income_type = data;
    });
  },
  methods: {
    dictFormatter(value) {
      return this.selectDictLabel(this.income_channel, value);
    },
    incomeTypeDictFormatter(value) {
      return this.selectDictLabel(this.income_type, value);
    },
    // 查询列表
    getList() {
      this.loading = true;
      getList(this.addDateRange(this.queryParams, this.dateRange)).then((response) => {
        this.list = response.data;
        this.loading = false;
      }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm('queryForm');
      this.queryParams = {};
      this.handleQuery();
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = deepClone(this.queryParams);
      for (var key in queryParams) {
        if (!queryParams[key]) {
          delete queryParams[key];
        }
      }
      const query = this.addDateRange(this.queryParams, this.dateRange);
      this.download('/collectionDaily/export', {
        ...query
      }, `收款日报${new Date().getTime()}.xlsx`);
    }
  }
};
</script>
<style lang="scss" scoped>
.form {
  ::v-deep .el-form-item--medium {
    width: 100%;
    display: flex;
    .el-form-item__content {
      width: 100%;
    }
  }
}
.total-content{
  display: flex;
  background-color: #ecf5ff;
  height: 32px;
  padding: 0 10px;
  line-height: 30px;
  font-size: 12px;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  box-sizing: border-box;
  white-space: nowrap;
  margin-bottom:20px;
  .total-item{
    flex: 1;
    text-align: center;
  }
}
</style>
