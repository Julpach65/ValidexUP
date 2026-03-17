import asyncio
import os
import sys
from decimal import Decimal

# Asegurar que reconozca los módulos de la app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import Session, select
from app.core.db import engine
from app.models.pipas import Pipa

async def seed_pipas():
    # Pipas usadas como mock en el UI de Abraham
    pipas_mock = [
        Pipa(placa="MX-8921", capacidad_litros=Decimal("20000.00"), proveedor="Pemex Logistics", estado="ACTIVA"),
        Pipa(placa="MX-7734", capacidad_litros=Decimal("15000.00"), proveedor="Z-Gas Transportes", estado="ACTIVA"),
        Pipa(placa="MX-5501", capacidad_litros=Decimal("18000.00"), proveedor="Pemex Refinación", estado="ACTIVA"),
        Pipa(placa="MX-2210", capacidad_litros=Decimal("25000.00"), proveedor="Combustibles MX", estado="MANTENIMIENTO"),
    ]

    print("Iniciando inyección de Pipas semilla...")
    with Session(engine) as session:
        for pipa in pipas_mock:
            # Check si ya existe
            existing = session.exec(select(Pipa).where(Pipa.placa == pipa.placa)).first()
            if not existing:
                session.add(pipa)
                print(f"✅ Agregada Pipa: {pipa.placa} ({pipa.capacidad_litros} L)")
            else:
                print(f"⚠️ Pipa ya existe: {pipa.placa}")
        
        session.commit()
    print("Inyección completada.")

if __name__ == "__main__":
    asyncio.run(seed_pipas())
