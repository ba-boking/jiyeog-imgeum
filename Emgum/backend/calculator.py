def calculate_min_wage(cpi: float, base_cpi: float = 105.0, base_wage: int = 10030) -> float:
    return round((cpi / base_cpi) * base_wage, 2)
