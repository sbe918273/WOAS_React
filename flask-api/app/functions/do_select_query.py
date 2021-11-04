def do_select_query(
    conn, 
    table, 
    columns, 
    criteria=None, 
    row_limit=None, 
    valid_min_rows=None, 
    valid_max_rows=None,
    order=None,
    distinct=False
    ):

    columns_string = ', '.join(columns)
    query_params = []

    select_query = """SELECT {0} {1} FROM {2}""".format(
        ('DISTINCT' if distinct else ''),
        columns_string, 
        table
    )

    if criteria is not None:
        where_string = ' WHERE'

        for idx, column in enumerate(criteria):

            if not idx == 0:
                where_string += ' AND'

            where_string += " {}=%s".format(column)
            query_params.append(criteria[column])

        select_query += where_string

    if order is not None:
        select_query += "ORDER BY {0} {1}".format(*order)

    if row_limit is not None:
        select_query += " LIMIT {}".format(row_limit)
    elif valid_max_rows is not None:
        select_query += " LIMIT {}".format(valid_max_rows+1)

    select_query += ';'

    cursor = conn.cursor()
    cursor.execute(select_query, query_params)
    response = cursor.fetchall()

    if valid_min_rows is not None:
        if cursor.rowcount < valid_min_rows:
            return None
    if valid_max_rows is not None:
        if cursor.rowcount > valid_max_rows:
            return None

    cursor.close()
    return response