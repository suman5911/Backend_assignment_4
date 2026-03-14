import express, { Router } from "express";
import { getLoans , getLoanById , createLoan , updateLoan , deleteLoan } from "../controllers/loanController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

router.get("/loans", authenticate, getLoans);

router.get("/loans/:id", authenticate, getLoanById);

router.post(
    "/loans",
    authenticate,
    isAuthorized({ hasRole: ["manager", "admin"] }),
    createLoan
);

router.put(
    "/loans/:id",
    authenticate,
    isAuthorized({ hasRole: ["manager", "admin"] }),
    updateLoan
);

router.delete(
    "/loans/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    deleteLoan
);

export default router;