import { faker } from "@faker-js/faker";
import { jest } from "@jest/globals";

import voucherService from "../../src/services/voucherService.js";
import voucherRepository from "../../src/repositories/voucherRepository.js";

describe("Create voucher test suite", () => {
    it("Given a valid code and discount, should create a voucher", async () => {
        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(
            null
        );
        jest.spyOn(voucherRepository, "createVoucher").mockResolvedValue(null);

        const code = faker.random.alphaNumeric(10);
        const discount = 10;

        await voucherService.createVoucher(code, discount);

        expect(voucherRepository.createVoucher).toHaveBeenCalledTimes(1);
    });

    it("Given a code already in use, should throw a conflict error", async () => {
        const code = faker.random.alphaNumeric(10);
        const discount = 10;

        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(
            {
                id: 1,
                code,
                discount,
                used: false,
            }
        );

        const promise = voucherService.createVoucher(code, discount);

        expect(promise).rejects.toEqual({
            message: "Voucher already exist.",
            type: "conflict",
        });
    });
});

describe("Aplly voucher test suite", () => {
    it("Given a valid code and amount, should return the correct object", async () => {
        const code = faker.random.alphaNumeric(10);
        const amount = 200;

        jest.spyOn(voucherRepository, "getVoucherByCode").mockResolvedValueOnce(
            {
                id: 1,
                code,
                discount: 20,
                used: false,
            }
        );
        jest.spyOn(voucherRepository, "useVoucher").mockResolvedValue(null);

        const response = await voucherService.applyVoucher(code, amount);
        expect(response).toEqual({
            amount,
            discount: 20,
            finalAmount: amount * 0.8,
            applied: true,
        });
    });
});
