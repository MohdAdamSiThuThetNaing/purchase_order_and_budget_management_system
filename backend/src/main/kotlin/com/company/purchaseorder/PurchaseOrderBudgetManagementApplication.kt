package com.company.purchaseorder

import com.company.purchaseorder.config.JwtProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties::class)
class PurchaseOrderBudgetManagementApplication

fun main(args: Array<String>) {
    runApplication<PurchaseOrderBudgetManagementApplication>(*args)
}
