package com.company.purchaseorder.vendor

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@RestController
@RequestMapping("/api/vendors")
class VendorController(
    private val vendorService: VendorService
) {

    @GetMapping
    fun getVendors(): List<VendorResponse> {
        return vendorService.getVendors()
    }

    @GetMapping("/{id}")
    fun getVendor(
        @PathVariable id: UUID
    ): VendorResponse {
        return vendorService.getVendor(id)
    }
}
