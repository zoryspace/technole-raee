/**
 * hooks/useAppData.js
 * ─────────────────────────────────────────────────────────
 * Estado global de la aplicación. Carga los datos al montar
 * y expone acciones que envuelven la capa api/client.js.
 *
 * Ventaja: ninguna página sabe cómo se persisten los datos.
 * ─────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback } from "react";
import { clientsApi, collectionsApi, certificatesApi } from "../api/client.js";

export function useAppData() {
  const [clients,     setClients]     = useState([]);
  const [collections, setCollections] = useState([]);
  const [certs,       setCerts]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  // ── Carga inicial ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const [c, col, cert] = await Promise.all([
          clientsApi.getAll(),
          collectionsApi.getAll(),
          certificatesApi.getAll(),
        ]);
        setClients(c);
        setCollections(col);
        setCerts(cert);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Clientes ───────────────────────────────────────────────
  const createClient = useCallback(async (data) => {
    const record = await clientsApi.create(data);
    setClients(prev => [...prev, record]);
    return record;
  }, []);

  const updateClient = useCallback(async (id, data) => {
    const record = await clientsApi.update(id, data);
    setClients(prev => prev.map(c => c.id === id ? record : c));
    return record;
  }, []);

  const deleteClient = useCallback(async (id) => {
    await clientsApi.delete(id);
    setClients(prev => prev.filter(c => c.id !== id));
  }, []);

  // ── Recogidas ──────────────────────────────────────────────
  const createCollection = useCallback(async (data) => {
    const record = await collectionsApi.create(data);
    setCollections(prev => [...prev, record]);
    return record;
  }, []);

  const updateCollection = useCallback(async (id, data) => {
    const record = await collectionsApi.update(id, data);
    setCollections(prev => prev.map(c => c.id === id ? record : c));
    return record;
  }, []);

  const deleteCollection = useCallback(async (id) => {
    await collectionsApi.delete(id);
    setCollections(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateDevices = useCallback(async (collectionId, devices) => {
    const record = await collectionsApi.updateDevices(collectionId, devices);
    setCollections(prev => prev.map(c => c.id === collectionId ? record : c));
    return record;
  }, []);

  // ── Certificados ───────────────────────────────────────────
  const generateCert = useCallback(async (collectionId) => {
    const cert = await certificatesApi.generate(collectionId);
    setCerts(prev => [...prev, cert]);
    // Marca la recogida como certificada en el estado local
    setCollections(prev => prev.map(c =>
      c.id === collectionId ? { ...c, certified: true, certId: cert.id } : c
    ));
    return cert;
  }, []);

  return {
    // Estado
    clients, collections, certs,
    loading, error,
    // Acciones — clientes
    createClient, updateClient, deleteClient,
    // Acciones — recogidas
    createCollection, updateCollection, deleteCollection, updateDevices,
    // Acciones — certificados
    generateCert,
  };
}
