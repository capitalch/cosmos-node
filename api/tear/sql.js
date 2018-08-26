let sql = {
    hours:`
    select r.FullName, ProjectName, Date=CAST(Date AS DATE),   
Billable=SUM(ActualWorkBillable), NonBillable=SUM(ActualWorkNonBillable),  WorkDays=1456
	from NWTA_TimeSheet t
		join NWTA_Resource r
			on r.ResourceUID = t.OwnerResourceUID
		join NWTA_TimesheetLine l
			on l.TimesheetUID = t.TimesheetUID
		join NWTA_TimesheetActual a
			on a.TimesheetLineUID = l.TimesheetLineUID
		join NWTA_Assignment n
			on n.AssignmentUID = l.AssignmentUID
		join NWTA_Task s
			on s.TaskUID = n.TaskUID
		join NWTA_Project pr
			on pr.ProjectUID = s.ProjectUID			
	where 	
		a.Date >= '{{dateFrom}}'
		and a.Date <= '{{dateTo}}'
		and (ActualWorkBillable > 0 or ActualWorkNonBillable > 0)
	GROUP by r.FullName, ProjectName, Date
	order by r.FullName, Date
    `
    ,hours1: `select r.FullName, ProjectName, TimesheetName,   
Billable=SUM(ActualWorkBillable), NonBillable=SUM(ActualWorkNonBillable)
	from NWTA_TimeSheet t
		join NWTA_Resource r
			on r.ResourceUID = t.OwnerResourceUID
		join NWTA_Period p
			on p.PeriodUID = t.PeriodUID
		join NWTA_TimesheetLine l
			on l.TimesheetUID = t.TimesheetUID
		join NWTA_TimesheetActual a
			on a.TimesheetLineUID = l.TimesheetLineUID
		join NWTA_Assignment n
			on n.AssignmentUID = l.AssignmentUID
		join NWTA_Task s
			on s.TaskUID = n.TaskUID
		join NWTA_Project pr
			on pr.ProjectUID = s.ProjectUID
			
	where 
	--r.FullName like 'sushant%' and
		p.StartDate >= '2016-07-02'
		and p.EndDate <= '2016-12-30'
		and (ActualWorkBillable > 0 or ActualWorkNonBillable > 0)
	GROUP by r.FullName, ProjectName, TimesheetName, AssignmentName, p.StartDate
	order by r.FullName,p.StartDate`
};
module.exports = sql;