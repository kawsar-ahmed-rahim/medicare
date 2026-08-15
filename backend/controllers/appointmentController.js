import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import dotenv from 'dotenv';
import stripe from "stripe";
import {getAuth} from "@clerk/express";
import {clerkClient} from "@clerk/express";
dotenv.config();

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const MAJOR_ADMIN_ID  =  process.env.MAJOR_ADMIN_ID || null;
const stripe = STRIPE_KEY ? new Stripe(STRIPE_KEY, {apiVersion: "2023-10-16"}) : null;

//helpers
const safeNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const buildFrontendBase = (req) => {
  if (FRONTEND_URL) return FRONTEND_URL.replace(/\/$/, "");
  const origin = req.get("origin") || req.get("referer");
  if (origin) return origin.replace(/\/$/, "");
  const host = req.get("host");
  if (host) return `${req.protocol || "http"}://${host}`.replace(/\/$/, "");
  return null;
};

function resolveClerkUserId(req) {
  try {
    const auth = req.auth || {};
    const fromReq = auth?.userId || auth?.user_id || auth?.user?.id || req.user?.id || null;
    if (fromReq) return fromReq;
    try {
      const serverAuth = getAuth ? getAuth(req) : null;
      return serverAuth?.userId || null;
    } catch (e) {
      return null;
    }
  } catch (e) {
    return null;
  }
}

// to get Appointments

export const getAppointments = async (req, res) => {
    try {
         const { doctorId, mobile, status, search = "", limit: limitRaw = 50, page: pageRaw = 1, patientClerkId, createdBy } = req.query;
    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 50));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (doctorId) filter.doctorId = doctorId;
    if (mobile) filter.mobile = mobile;
    if (status) filter.status = status;
    if (patientClerkId) filter.createdBy = patientClerkId;
    if (createdBy) filter.createdBy = createdBy;
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ patientName: re }, { mobile: re }, { notes: re }];
    }
    const items = await Appointment.find(filter).sort({ createdAt: -1}).skip(skip).limit(limit).populate("doctorId", "name specialization owner imageUrl image").lean();

    const total = await Appointment.countDocuments(filter);
    return res.json({
        success: true,
        appointments: items,
        meta: {page, limit, total, count: items.length}
    })
    } catch (error) {
        console.error("getAppointments error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
    }
}

// to getAppointments By patient