function showReport() {
    $("#root").html('<span>Loading...</span>');
    let dateFrom = $('#yearFrom').val() + '-' + $('#monthFrom').val() + '-' + $('#dayFrom').val();
    let dateTo = $('#yearTo').val() + '-' + $('#monthTo').val() + '-' + $('#dayTo').val();
    $.ajax({
        url: "/apps/tear/api/reportA",
        data: { dateFrom: dateFrom, dateTo:dateTo },
        success: function (result) {            

            $("#root").pivotUI(result[0], {
                rows: ["FullName"],
                cols: ["ProjectName"],
                vals: ["Billable"],
                rendererName: "Heatmap",
                aggregatorName: "Integer Sum"
            })
        }
    });
}