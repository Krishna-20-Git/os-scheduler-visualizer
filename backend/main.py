from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- UTILITY FUNCTIONS ---
def calculate_metrics(processes, log):
    completion_times = {}
    last_event_time = 0
    if log:
        for event in reversed(log):
            if event['process'] and event['process'] not in completion_times:
                completion_times[event['process']] = event['time'] + 1
        last_event_time = log[-1]['time'] + 1

    for p in processes:
        if p['name'] not in completion_times:
            # Handle processes that never ran (e.g., arrival > total time)
            completion_times[p['name']] = p['arrival'] + p['burst']

    total_waiting_time = 0
    total_turnaround_time = 0
    details = []

    for p in processes:
        ct = completion_times.get(p['name'], 0)
        tat = ct - p['arrival']
        wt = tat - p['burst']
        
        # Waiting time cannot be negative
        if wt < 0: wt = 0

        total_turnaround_time += tat
        total_waiting_time += wt
        
        details.append({
            "name": p['name'], "arrival": p['arrival'], "burst": p['burst'], 
            "priority": p.get('priority', 'N/A'), "ct": ct, "tat": tat, "wt": wt
        })

    num_processes = len(processes)
    avg_waiting_time = round(total_waiting_time / num_processes, 2) if num_processes > 0 else 0
    avg_turnaround_time = round(total_turnaround_time / num_processes, 2) if num_processes > 0 else 0

    return {"avg_waiting_time": avg_waiting_time, "avg_turnaround_time": avg_turnaround_time, "details": details}

# --- SCHEDULING ALGORITHMS ---
# All algorithm functions (fcfs, sjf_non_preemptive, etc.) remain the same...
def fcfs(processes, *args):
    processes.sort(key=lambda x: x['arrival'])
    time = 0
    log = []
    ready_queue = []
    process_queue = processes.copy()
    remaining_burst = {p['name']: p['burst'] for p in processes}
    
    while process_queue or any(v > 0 for v in remaining_burst.values()):
        newly_arrived = [p for p in process_queue if p['arrival'] <= time]
        ready_queue.extend(newly_arrived)
        for p in newly_arrived:
            process_queue.remove(p)

        current_process = None
        if ready_queue:
            current_process_obj = ready_queue[0]
            current_process = current_process_obj['name']
            
            log.append({'time': time, 'process': current_process, 'ready_queue': [p['name'] for p in ready_queue if p['name'] != current_process]})
            remaining_burst[current_process] -= 1

            if remaining_burst[current_process] == 0:
                ready_queue.pop(0)
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
        
        time += 1
        if time > 300: break 
        
    return log

def sjf_non_preemptive(processes, *args):
    time = 0
    log = []
    ready_queue = []
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    remaining_burst = {p['name']: p['burst'] for p in processes}
    current_process = None
    
    while process_queue or any(v > 0 for v in remaining_burst.values()):
        newly_arrived = [p for p in process_queue if p['arrival'] <= time]
        ready_queue.extend(newly_arrived)
        for p in newly_arrived:
            process_queue.remove(p)
        
        if not current_process and ready_queue:
            ready_queue.sort(key=lambda x: x['burst'])
            current_process_obj = ready_queue.pop(0)
            current_process = current_process_obj['name']
        
        if current_process:
            log.append({'time': time, 'process': current_process, 'ready_queue': [p['name'] for p in ready_queue]})
            remaining_burst[current_process] -= 1
            if remaining_burst[current_process] == 0:
                current_process = None
        else:
            log.append({'time': time, 'process': None, 'ready_queue': [p['name'] for p in ready_queue]})

        time += 1
        if time > 300: break
    
    return log

def sjf_preemptive(processes, *args): # SRTF
    time = 0
    log = []
    ready_queue = []
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    remaining_burst = {p['name']: p['burst'] for p in processes}
    
    while process_queue or any(v > 0 for v in remaining_burst.values()):
        newly_arrived = [p for p in process_queue if p['arrival'] <= time]
        ready_queue.extend(newly_arrived)
        for p in newly_arrived:
            process_queue.remove(p)
            
        if ready_queue:
            ready_queue.sort(key=lambda p: remaining_burst[p['name']])
            current_process_obj = ready_queue[0]
            current_process = current_process_obj['name']
            
            log.append({'time': time, 'process': current_process, 'ready_queue': [p['name'] for p in ready_queue if p['name'] != current_process]})
            remaining_burst[current_process] -= 1

            if remaining_burst[current_process] == 0:
                ready_queue.pop(0)
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
        
        time += 1
        if time > 300: break
        
    return log

def priority_non_preemptive(processes, order):
    time = 0
    log = []
    ready_queue = []
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    remaining_burst = {p['name']: p['burst'] for p in processes}
    current_process = None
    
    reverse_sort = order == 'highIsHigh'

    while process_queue or any(v > 0 for v in remaining_burst.values()):
        newly_arrived = [p for p in process_queue if p['arrival'] <= time]
        ready_queue.extend(newly_arrived)
        for p in newly_arrived:
            process_queue.remove(p)
        
        if not current_process and ready_queue:
            ready_queue.sort(key=lambda x: x['priority'], reverse=reverse_sort)
            current_process_obj = ready_queue.pop(0)
            current_process = current_process_obj['name']
        
        if current_process:
            log.append({'time': time, 'process': current_process, 'ready_queue': [p['name'] for p in ready_queue]})
            remaining_burst[current_process] -= 1
            if remaining_burst[current_process] == 0:
                current_process = None
        else:
            log.append({'time': time, 'process': None, 'ready_queue': [p['name'] for p in ready_queue]})
        
        time += 1
        if time > 300: break
        
    return log

def priority_preemptive(processes, order):
    time = 0
    log = []
    ready_queue = []
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    remaining_burst = {p['name']: p['burst'] for p in processes}
    
    reverse_sort = order == 'highIsHigh'

    while process_queue or any(v > 0 for v in remaining_burst.values()):
        newly_arrived = [p for p in process_queue if p['arrival'] <= time]
        ready_queue.extend(newly_arrived)
        for p in newly_arrived:
            process_queue.remove(p)

        if ready_queue:
            ready_queue.sort(key=lambda p: p['priority'], reverse=reverse_sort)
            current_process_obj = ready_queue[0]
            current_process = current_process_obj['name']

            log.append({'time': time, 'process': current_process, 'ready_queue': [p['name'] for p in ready_queue if p['name'] != current_process]})
            remaining_burst[current_process] -= 1

            if remaining_burst[current_process] == 0:
                for i, p_obj in enumerate(ready_queue):
                    if p_obj['name'] == current_process:
                        ready_queue.pop(i)
                        break
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
        
        time += 1
        if time > 300: break

    return log

def round_robin(processes, quantum):
    time = 0
    log = []
    ready_queue = []
    process_queue = sorted(processes, key=lambda x: x['arrival'])
    remaining_burst = {p['name']: p['burst'] for p in processes}
    time_slice = 0
    
    while process_queue or any(v > 0 for v in remaining_burst.values()):
        newly_arrived = [p for p in process_queue if p['arrival'] <= time]
        for p in newly_arrived:
            if p not in ready_queue:
                ready_queue.append(p)
        for p in newly_arrived:
            process_queue.remove(p)

        if ready_queue:
            current_process_obj = ready_queue[0]
            current_process = current_process_obj['name']

            log.append({'time': time, 'process': current_process, 'ready_queue': [p['name'] for p in ready_queue[1:]]})
            remaining_burst[current_process] -= 1
            time_slice += 1

            if remaining_burst[current_process] == 0:
                ready_queue.pop(0)
                time_slice = 0
            elif time_slice == quantum:
                ready_queue.append(ready_queue.pop(0))
                time_slice = 0
        else:
            log.append({'time': time, 'process': None, 'ready_queue': []})
            
        time += 1
        if time > 300: break

    return log

# --- API ENDPOINTS ---

@app.route('/api/schedule', methods=['POST'])
def schedule():
    data = request.json
    processes = data['processes']
    algorithm = data['algorithm']
    time_quantum = data.get('timeQuantum', 4)
    priority_order = data.get('priorityOrder', 'lowIsHigh')
    
    log = []
    # ... logic for single simulation ...
    if algorithm == 'fcfs': log = fcfs(processes)
    elif algorithm == 'sjf_non_preemptive': log = sjf_non_preemptive(processes)
    elif algorithm == 'sjf_preemptive': log = sjf_preemptive(processes)
    elif algorithm == 'priority_non_preemptive': log = priority_non_preemptive(processes, priority_order)
    elif algorithm == 'priority_preemptive': log = priority_preemptive(processes, priority_order)
    elif algorithm == 'roundrobin': log = round_robin(processes, time_quantum)
        
    metrics = calculate_metrics(processes, log)
    return jsonify({"log": log, "metrics": metrics})

@app.route('/api/compare', methods=['POST'])
def compare():
    data = request.json
    processes = data['processes']
    time_quantum = data.get('timeQuantum', 4)
    priority_order = data.get('priorityOrder', 'lowIsHigh')

    results = {}
    
    # *** UPDATED to include preemptive algorithms ***
    algorithms_to_compare = {
        "FCFS": (fcfs, []),
        "SJF (Non-P)": (sjf_non_preemptive, []),
        "SJF (Preemptive)": (sjf_preemptive, []),
        "Priority (Non-P)": (priority_non_preemptive, [priority_order]),
        "Priority (Preemptive)": (priority_preemptive, [priority_order]),
        "Round Robin": (round_robin, [time_quantum])
    }
    
    for name, (func, args) in algorithms_to_compare.items():
        processes_copy = [p.copy() for p in processes]
        log = func(processes_copy, *args)
        metrics = calculate_metrics(processes, log)
        results[name] = {"log": log, "metrics": metrics}
        
    return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True)

